package com.gamestore_back.repository;

import com.gamestore_back.domain.EqCart;
import com.gamestore_back.domain.EqCartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EqCartItemRepository extends JpaRepository<EqCartItem, Long> {

    // 특정 이메일과 장비 ID로 아이템 조회
    Optional<EqCartItem> findByOwnerEmailAndGamingEquipment_Id(String ownerEmail, Long equipmentId);

    // 특정 이메일의 모든 아이템 조회
    List<EqCartItem> findByOwnerEmail(String ownerEmail);
}
