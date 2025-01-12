package com.gamestore_back.service;

import com.gamestore_back.domain.Category;
import com.gamestore_back.domain.Game;
import com.gamestore_back.dto.GameDTO;
import com.gamestore_back.repository.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ModelMapper modelMapper;

    // 생성자를 통해 CategoryRepository와 ModelMapper를 주입받습니다.
    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository, ModelMapper modelMapper) {
        this.categoryRepository = categoryRepository;
        this.modelMapper = modelMapper;
    }

    // 모든 카테고리를 조회하는 메서드
    @Override
    public List<Category> getAllCategories() {
        // category 테이블의 모든 레코드를 반환합니다.
        return categoryRepository.findAll();
    }

    // ID를 기반으로 특정 카테고리를 조회하는 메서드
    @Override
    public Category getCategoryById(Long categoryId) {
        // category_id를 기준으로 카테고리를 조회합니다.
        Optional<Category> category = categoryRepository.findById(categoryId);

        // 값이 존재하지 않을 경우 null 반환
        return category.orElse(null);
    }

    // 새로운 카테고리를 생성하고 저장하는 메서드
    @Override
    public Category createCategory(Category category) {
        // 새로운 카테고리 객체를 데이터베이스에 저장
        return categoryRepository.save(category);
    }

    // 기존 카테고리를 ID를 기준으로 업데이트하는 메서드
    @Override
    public Category updateCategory(Long categoryId, Category category) {
        // ID에 해당하는 카테고리가 존재할 경우에만 업데이트
        if (categoryRepository.existsById(categoryId)) {
            // 기존 카테고리 ID를 유지하고 나머지 필드를 업데이트
            category.setCategoryId(categoryId);
            return categoryRepository.save(category);
        }
        // 존재하지 않을 경우 null 반환
        return null;
    }

    // ID를 기반으로 카테고리를 삭제하는 메서드
    @Override
    public void deleteCategory(Long id) {
        // category_id를 기준으로 해당 카테고리 삭제
        categoryRepository.deleteById(id);
    }

    // 특정 카테고리의 게임 목록을 반환하는 메서드
    @Override
    public List<GameDTO> getGamesByCategory(Long categoryId) {
        // category_id로 카테고리 객체를 조회
        // 만약 존재하지 않을 경우 IllegalArgumentException 발생
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 존재하지 않습니다. ID: " + categoryId));

        // 카테고리와 연관된 게임 목록을 가져와 DTO로 변환
        return category.getGames().stream()
                .map(game -> modelMapper.map(game, GameDTO.class)) // ModelMapper를 사용해 Game -> GameDTO로 변환
                .collect(Collectors.toList());
    }
}
