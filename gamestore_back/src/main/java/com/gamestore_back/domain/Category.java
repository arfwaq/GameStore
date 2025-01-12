package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private Long categoryId;

    @Column(name = "category_name", nullable = false)
    private String categoryName;

    @Column(name = "category_type", nullable = false)
    private String categoryType;

    @ManyToMany(mappedBy = "categories")
    private List<Game> games; // 카테고리에 속한 여러 게임
}
