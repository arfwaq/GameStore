package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString(exclude = {"cart", "game"})
@Table(name = "tbl_cart_item", indexes = {
        @Index(columnList = "cart_cno", name = "idx_cartitem_cart"),
        @Index(columnList = "game_app_id, cart_cno", name = "idx_cartitem_game_cart")
})
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cino; // 장바구니 항목 ID

    @ManyToOne
    @JoinColumn(name = "game_app_id", nullable = false) // 게임과의 관계 설정
    private Game game;

    @ManyToOne
    @JoinColumn(name = "cart_cno", nullable = false) // 장바구니와의 관계 설정
    private Cart cart;
}
