package com.gamestore_back.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class GameDTO {
    private Long appId;                  // 게임 ID
    private String gameName;             // 게임 이름
    private String gameDescription;      // 게임 설명
    private BigDecimal price;            // 가격
    private Integer discountRate;        // 할인율
    private LocalDate releaseDate;       // 출시일
    private String thumbnailUrl;         // 썸네일 URL
    private String trailerUrl;           // 트레일러 URL
    private String minimumPcRequirements; // 최소 PC 요구 사항
    private String recommendedPcRequirements; // 권장 PC 요구 사항
    private String genre;                // 장르
    private String ageRestriction;       // 나이 제한
    private Integer recommendations;     // 추천 수
    private String supportedLanguages;   // 지원 언어
}
