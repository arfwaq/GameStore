package com.gamestore_back.service;

import com.gamestore_back.domain.*;
import com.gamestore_back.dto.RefundRequestDTO;
import com.gamestore_back.dto.RefundResponseDTO;
import com.gamestore_back.repository.RefundRepository;
import com.gamestore_back.repository.OrderRepository;
import com.gamestore_back.repository.GameRepository;
import com.gamestore_back.repository.GamingEquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RefundServiceImpl implements RefundService {

    private final RefundRepository refundRepository;
    private final OrderRepository orderRepository;
    private final GameRepository gameRepository;
    private final GamingEquipmentRepository equipmentRepository;

    /**
     * 환불 요청 생성
     */
    @Override
    @Transactional
    public void createRefundRequest(RefundRequestDTO refundRequestDTO) {
        // 1) 주문 찾기
        Order order = orderRepository.findById(refundRequestDTO.getOrderId())
                .orElseThrow(() -> new IllegalArgumentException("주문을 찾을 수 없습니다."));

        // 2) "게임" vs "장비" 찾기 (optional)
        Game game = null;
        GamingEquipment equipment = null;

        if (refundRequestDTO.getAppId() != null) {
            game = gameRepository.findById(refundRequestDTO.getAppId())
                    .orElseThrow(() -> new IllegalArgumentException("게임을 찾을 수 없습니다. AppId=" + refundRequestDTO.getAppId()));
        } else if (refundRequestDTO.getEquipmentId() != null) {
            equipment = equipmentRepository.findById(refundRequestDTO.getEquipmentId())
                    .orElseThrow(() -> new IllegalArgumentException("장비를 찾을 수 없습니다. equipmentId=" + refundRequestDTO.getEquipmentId()));
        }

        // 환불 요청 생성
        Refund refund = Refund.builder()
                .order(order)
                .game(game)
                .gameEquipment(equipment)
                .player(order.getPlayer()) // 주문과 연결된 유저
                .status(RefundStatus.PENDING)
                .requestDate(LocalDateTime.now())
                .build();

        refundRepository.save(refund);
    }

    /**
     * 대기 중인 환불 요청 목록 조회
     */
    @Override
    @Transactional(readOnly = true)
    public List<RefundResponseDTO> getPendingRefundRequests() {
        return refundRepository.findByStatus(RefundStatus.PENDING)
                .stream()
                .map(refund -> {
                    // Refund -> RefundResponseDTO
                    RefundResponseDTO.RefundResponseDTOBuilder builder = RefundResponseDTO.builder()
                            .refundId(refund.getRefundId())
                            .orderId(refund.getOrder().getOrderId())
                            .email(refund.getPlayer().getEmail())
                            .status(refund.getStatus().name())
                            .requestDate(refund.getRequestDate());

                    // "게임" 환불
                    if (refund.getGame() != null) {
                        builder.appId(refund.getGame().getAppId())
                                .gameName(refund.getGame().getGameName())
                                .thumbnailUrl(refund.getGame().getThumbnailUrl())
                                .price(refund.getGame().getPrice());
                    }
                    // "장비" 환불
                    if (refund.getGameEquipment() != null) {
                        builder.equipmentId(refund.getGameEquipment().getId())
                                .equipmentName(refund.getGameEquipment().getName())
                                .equipmentImageUrl(refund.getGameEquipment().getImageUrl());
                        // 필요하면 장비 가격 등도 세팅
                    }

                    return builder.build();
                })
                .collect(Collectors.toList());
    }

    /**
     * 환불 요청 승인 (관리자)
     */
    @Override
    @Transactional
    public void approveRefund(Long refundId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new IllegalArgumentException("환불 요청을 찾을 수 없습니다."));

        // 1) Refund 삭제 or 상태변경 - 정책에 따라
        //   현재 코드는 Refund 엔티티를 삭제
        refundRepository.delete(refund);

        // 2) Order도 삭제
        //   "게임/장비" 관계없이 Order 삭제
        orderRepository.delete(refund.getOrder());
    }

    /**
     * 환불 요청 거절 (관리자)
     */
    @Override
    @Transactional
    public void rejectRefund(Long refundId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new IllegalArgumentException("환불 요청을 찾을 수 없습니다."));

        // 환불 상태 업데이트
        refund.setStatus(RefundStatus.REJECTED);
        refundRepository.save(refund);
    }
}
