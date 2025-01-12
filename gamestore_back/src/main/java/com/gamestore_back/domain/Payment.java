package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @Column(name = "order_id")
    private Long orderId; // Order의 ID를 Payment의 기본 키로 사용

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // orderId를 기본 키로 사용
    @JoinColumn(name = "order_id")
    private Order order;

    @Column(nullable = false)
    private double paymentAmount; // 결제 금액

    @Column(nullable = false)
    private LocalDateTime paymentDate; // 결제 날짜
}
