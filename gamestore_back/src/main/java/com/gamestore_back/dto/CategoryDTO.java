package com.gamestore_back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryDTO {

    private Long categoryId;  // 카테고리 고유 ID
    private String categoryName;  // 카테고리 이름
    private String categoryType;  // 카테고리 유형
}
