package com.gamestore_back.repository;

import com.gamestore_back.domain.EqCart;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EqCartRepository extends JpaRepository<EqCart, Long> {
    // 이메일로 장바구니 조회
    Optional<EqCart> findByOwnerEmail(String ownerEmail);
}
