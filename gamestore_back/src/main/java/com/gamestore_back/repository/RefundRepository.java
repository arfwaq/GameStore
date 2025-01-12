package com.gamestore_back.repository;

import com.gamestore_back.domain.Refund;
import com.gamestore_back.domain.RefundStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {

    // 특정 유저의 환불 요청 조회
    List<Refund> findByPlayer_Email(String email);

    // 특정 상태의 환불 요청 조회 (예: PENDING 상태)
    List<Refund> findByStatus(RefundStatus status);
}
