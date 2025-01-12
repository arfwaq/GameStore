package com.gamestore_back.service;

import com.gamestore_back.domain.Category;
import com.gamestore_back.dto.GameDTO;

import java.util.List;

public interface CategoryService {
    List<Category> getAllCategories(); // 모든 카테고리 조회
    Category getCategoryById(Long id);
    Category createCategory(Category category);
    Category updateCategory(Long id, Category category);
    void deleteCategory(Long id);

    // 특정 카테고리의 게임 반환
    List<GameDTO> getGamesByCategory(Long CategoryId);
}