package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
public class Game {

    @Id
    @Column(name = "app_id", nullable = false) // Steam의 appId를 기본 키로 사용
    private Long appId;

    @Column(name = "game_name", nullable = false)
    private String gameName;

    @Column(name = "game_description", columnDefinition = "TEXT")
    private String gameDescription;

    // price를 BigDecimal 타입으로 변경
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "discount_rate")
    private Integer discountRate;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "thumbnail_url")
    private String thumbnailUrl;

    @Column(name = "trailer_url")
    private String trailerUrl;

    @Column(name = "minimum_pc_requirements", columnDefinition = "TEXT")
    private String minimumPcRequirements;

    @Column(name = "recommended_pc_requirements", columnDefinition = "TEXT")
    private String recommendedPcRequirements;

    @Column(name = "genre", columnDefinition = "TEXT")
    private String genre;

    @Column(name = "age_restriction")
    private String ageRestriction;

    @Column(name = "recommendations")
    private Integer recommendations;

    @Column(name = "supported_languages", columnDefinition = "TEXT")
    private String supportedLanguages;

    @ManyToMany
    @JoinTable(
            name = "game_category",
            joinColumns = @JoinColumn(name = "app_id"), // Game의 app_id와 매핑
            inverseJoinColumns = @JoinColumn(name = "category_id") // Category의 category_id와 매핑
    )
    private List<Category> categories;
}
