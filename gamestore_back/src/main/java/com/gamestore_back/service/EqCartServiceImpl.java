package com.gamestore_back.service;

import com.gamestore_back.domain.EqCart;
import com.gamestore_back.domain.EqCartItem;
import com.gamestore_back.domain.GamingEquipment;
import com.gamestore_back.repository.EqCartItemRepository;
import com.gamestore_back.repository.EqCartRepository;
import com.gamestore_back.repository.GamingEquipmentRepository;
import com.gamestore_back.service.EqCartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class EqCartServiceImpl implements EqCartService {

    private final EqCartRepository eqCartRepository;
    private final EqCartItemRepository eqCartItemRepository;
    private final GamingEquipmentRepository gamingEquipmentRepository;

    @Override
    public List<EqCartItem> getCartItems(String ownerEmail) {
        // 이메일로 장바구니 아이템 조회
        return eqCartItemRepository.findByOwnerEmail(ownerEmail);
    }

    @Override
    public void addToCart(String ownerEmail, Long equipmentId, int quantity) {
        EqCart eqCart = eqCartRepository.findByOwnerEmail(ownerEmail)
                .orElseGet(() -> eqCartRepository.save(EqCart.builder().ownerEmail(ownerEmail).build()));

        EqCartItem existingItem = eqCartItemRepository.findByOwnerEmailAndGamingEquipment_Id(ownerEmail, equipmentId)
                .orElse(null);

        if (existingItem != null) {
            // 기존 아이템이 있으면 수량만 증가
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
        } else {
            // 새 아이템 생성
            GamingEquipment equipment = gamingEquipmentRepository.findById(equipmentId)
                    .orElseThrow(() -> new RuntimeException("장비를 찾을 수 없습니다."));

            EqCartItem newItem = EqCartItem.builder()
                    .eqCart(eqCart)
                    .gamingEquipment(equipment)
                    .quantity(quantity)
                    .ownerEmail(ownerEmail) // 명시적으로 설정
                    .build();

            eqCartItemRepository.save(newItem);
        }
    }


    @Override
    public void removeFromCart(String ownerEmail, Long equipmentId) {
        // 특정 이메일과 장비 ID로 아이템 찾기
        EqCartItem item = eqCartItemRepository
                .findByOwnerEmailAndGamingEquipment_Id(ownerEmail, equipmentId)
                .orElseThrow(() -> new RuntimeException("장바구니에 해당 장비가 없습니다."));

        // 삭제
        eqCartItemRepository.delete(item);
    }

    @Override
    public void updateCartQuantity(String ownerEmail, Long equipmentId, int newQuantity) {
        if (newQuantity <= 0) {
            // 0 이하라면 삭제 처리
            removeFromCart(ownerEmail, equipmentId);
            return;
        }

        // 특정 이메일과 장비 ID로 아이템 찾기
        EqCartItem item = eqCartItemRepository
                .findByOwnerEmailAndGamingEquipment_Id(ownerEmail, equipmentId)
                .orElseThrow(() -> new RuntimeException("장바구니에 해당 장비가 없습니다."));

        // 수량 변경
        item.setQuantity(newQuantity);
    }
}
