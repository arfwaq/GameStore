package com.gamestore_back.service;

import com.gamestore_back.domain.Game;
import com.gamestore_back.domain.GamingEquipment;
import com.gamestore_back.domain.Order;
import com.gamestore_back.domain.Player;
import com.gamestore_back.dto.OrderDTO;
import com.gamestore_back.dto.RefundRequestDTO;
import com.gamestore_back.repository.GameRepository;
import com.gamestore_back.repository.GamingEquipmentRepository;
import com.gamestore_back.repository.OrderRepository;
import com.gamestore_back.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final PlayerRepository playerRepository;

    private final GameRepository gameRepository;             // 게임 repo
    private final GamingEquipmentRepository equipmentRepo;    // 장비 repo

    private final RefundService refundService; // 환불 서비스

    @Override
    public OrderDTO createOrder(OrderDTO orderDTO) {
        // 1) 주문자 조회
        Player player = playerRepository.findByEmail(orderDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Player not found: " + orderDTO.getEmail()));

        // 2) Order 빌딩
        Order order = Order.builder()
                .player(player)
                .purchaseDate(LocalDateTime.now())
                .build();

        // [A] 게임 구매인 경우 (appId != null)
        if (orderDTO.getAppId() != null) {
            Game game = gameRepository.findById(orderDTO.getAppId())
                    .orElseThrow(() -> new IllegalArgumentException("Game not found: " + orderDTO.getAppId()));

            // 중복 구매 체크 (간단 예시)
            boolean alreadyPurchased = orderRepository.findByPlayerEmail(orderDTO.getEmail()).stream()
                    .anyMatch(o -> o.getGame() != null &&
                            o.getGame().getAppId().equals(orderDTO.getAppId()));
            if (alreadyPurchased) {
                throw new IllegalArgumentException("이미 구매한 게임입니다: " + orderDTO.getAppId());
            }

            order.setGame(game);
            order.setGameEquipment(null);
            order.setPurchasePrice(game.getPrice().doubleValue());

            // [B] 장비 구매인 경우 (equipmentId != null)
        } else if (orderDTO.getEquipmentId() != null) {
            GamingEquipment equipment = equipmentRepo.findById(orderDTO.getEquipmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Equipment not found: " + orderDTO.getEquipmentId()));

            // 중복 구매 체크 (간단 예시)
            boolean alreadyPurchased = orderRepository.findByPlayerEmail(orderDTO.getEmail()).stream()
                    .anyMatch(o -> o.getGameEquipment() != null &&
                            o.getGameEquipment().getId().equals(orderDTO.getEquipmentId()));
            if (alreadyPurchased) {
                throw new IllegalArgumentException("이미 구매한 장비입니다: " + orderDTO.getEquipmentId());
            }

            order.setGame(null);
            order.setGameEquipment(equipment);
            order.setPurchasePrice(equipment.getPrice().doubleValue());  // 예: Integer -> double
        } else {
            throw new IllegalArgumentException("Either appId or equipmentId must be provided.");
        }

        // 3) 저장
        Order savedOrder = orderRepository.save(order);

        // 4) DTO 리턴
        return toOrderDTO(savedOrder);
    }

    @Override
    public List<OrderDTO> getOrdersByPlayer(String email) {
        return orderRepository.findByPlayerEmail(email).stream()
                .map(this::toOrderDTO)
                .collect(Collectors.toList());
    }

    @Override
    public RefundRequestDTO createRefundRequest(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + orderId));

        // 환불 요청 생성
        RefundRequestDTO refundRequestDTO = new RefundRequestDTO(
                order.getOrderId(),
                (order.getGame() != null) ? order.getGame().getAppId() : null,
                null, // equipmentId -> null (게임 환불 시)
                order.getPlayer().getEmail()
        );

        refundService.createRefundRequest(refundRequestDTO);
        return refundRequestDTO;
    }

    // ========== 편의 메서드 ==========
    private OrderDTO toOrderDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setEmail(order.getPlayer().getEmail());
        dto.setPurchaseDate(order.getPurchaseDate());
        dto.setPurchasePrice(order.getPurchasePrice());

        // 만약 게임 구매였다면
        if (order.getGame() != null) {
            dto.setAppId(order.getGame().getAppId());
            dto.setGameName(order.getGame().getGameName());
            dto.setThumbnailUrl(order.getGame().getThumbnailUrl());
        }
        // 만약 장비 구매였다면
        if (order.getGameEquipment() != null) {
            dto.setEquipmentId(order.getGameEquipment().getId());
            dto.setEquipmentName(order.getGameEquipment().getName());
            dto.setEquipmentImageUrl(order.getGameEquipment().getImageUrl());
        }
        return dto;
    }
}
