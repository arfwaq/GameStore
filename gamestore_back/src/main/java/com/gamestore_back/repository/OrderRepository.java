package com.gamestore_back.repository;

import com.gamestore_back.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM Order o WHERE o.player.email = :email")
    List<Order> findByPlayerEmail(@Param("email") String email);

    // 특정 유저의 주문 내역 조회
//    List<Order> findByPlayerEmail(String email);

}