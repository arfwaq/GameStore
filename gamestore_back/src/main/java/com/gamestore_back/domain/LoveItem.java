package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Builder
@ToString(exclude = {"love", "game"})
@Table(name = "tbl_love_item", indexes = {
        @Index(columnList = "love_lno", name = "idx_loveitem_love"),
        @Index(columnList = "game_app_id, love_lno", name = "idx_loveitem_game_love")
})
public class LoveItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lino; // 찜 항목 ID

    @ManyToOne
    @JoinColumn(name = "game_app_id", nullable = false) // 게임과의 관계 설정
    private Game game;

    @ManyToOne
    @JoinColumn(name = "love_lno", nullable = false) // 찜과의 관계 설정
    private Love love;
}
