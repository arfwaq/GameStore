package com.gamestore_back.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@ToString
@Table(name = "gaming_equipments")
public class GamingEquipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "game_equipment_id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    private Integer price;
    private String description;

    @Column(name = "brand")
    private String brand;

    private String imageUrl;
    private String productUrl;

    @Column(updatable = false)
    private LocalDateTime createAt = LocalDateTime.now();

    // 기본 생성자
    public GamingEquipment() {
        this.brand = "NoBrand"; // 기본값 설정
    }
}
