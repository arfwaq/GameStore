package com.gamestore_back.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
public class CartItemListDTO {

    private Long cino;               // 장바구니 항목 ID
    private Long appId;             // 게임 ID
    private String gameDescription; // 게임 설명
    private String gameName;        // 게임 이름
    private BigDecimal price;       // 게임 가격
    private String thumbnailUrl;    // 썸네일 이미지 URL
    private String trailerUrl;      // 트레일러 URL

    // JPQL select new ... 생성자
    public CartItemListDTO(
            Long cino,
            Long appId,
            String gameDescription,
            String gameName,
            BigDecimal price,
            String thumbnailUrl,
            String trailerUrl
    ) {
        this.cino = cino;
        this.appId = appId;
        this.gameDescription = gameDescription;
        this.gameName = gameName;
        this.price = price;
        this.thumbnailUrl = thumbnailUrl;
        this.trailerUrl = trailerUrl;
    }
}
