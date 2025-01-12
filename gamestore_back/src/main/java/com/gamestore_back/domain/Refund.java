package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "refunds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Refund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "refund_id")
    private Long refundId;

    // 환불 요청한 유저
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email", nullable = false)
    private Player player;

    /**
     * 게임 환불일 때 → game != null, gameEquipment == null
     * 장비 환불일 때 → game == null, gameEquipment != null
     * 둘 다 NULL인 상황은 없도록 로직에서 제어
     */

    // (1) "게임" 환불인 경우
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "app_id", nullable = true)
    private Game game;

    // (2) "장비" 환불인 경우
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "game_equipment_id", nullable = true)
    private GamingEquipment gameEquipment;

    /**
     * 어떤 주문(Order)에 대한 환불인지 (게임이든 장비이든 하나의 Order 레코드)
     * -> Order 엔티티도 "game" or "gameEquipment"를 가지고 있기 때문에,
     *    refund 시 "어떤 주문"을 참조
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    // 환불 상태 (예: PENDING, APPROVED, REJECTED 등)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private RefundStatus status;

    // 환불 요청 날짜
    @Column(name = "reg_date", nullable = false)
    private LocalDateTime requestDate;
}
