package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    // 주문한 유저
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email", nullable = false)
    private Player player;

    // === [게임 구매용] ===
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "app_id")
    private Game game; // null 가능

    // === [장비 구매용] ===
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "game_equipment_id")
    private GamingEquipment gameEquipment; // null 가능

    @Column(nullable = false)
    private double purchasePrice;

    @Column(nullable = false)
    private LocalDateTime purchaseDate;
}
