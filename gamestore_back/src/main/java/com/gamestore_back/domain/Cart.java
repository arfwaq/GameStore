package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString(exclude = {"owner", "items"})
@Table(
        name = "tbl_cart",
        indexes = {@Index(name = "idx_cart_email", columnList = "player_owner")}
)
public class Cart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cno; // 장바구니 ID

    @OneToOne
    @JoinColumn(name = "player_owner") // 사용자와 연결
    private Player owner;

    @Column(nullable = false, unique = true)
    private String ownerEmail;

    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CartItem> items = new ArrayList<>(); // 장바구니 항목 리스트
}
