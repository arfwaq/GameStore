package com.gamestore_back.controller;

import com.gamestore_back.dto.CategoryDTO;
import com.gamestore_back.dto.GameDTO;
import com.gamestore_back.service.CategoryService;
import com.gamestore_back.service.GameService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * CategoryController는 카테고리 관련 HTTP 요청을 처리하는 컨트롤러입니다.
 * 주요 기능:
 * 1. 모든 카테고리 조회
 * 2. 특정 카테고리의 게임 목록 조회
 * 3. 다중 필터 및 검색 기능을 통한 게임 조회
 */
@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://localhost:3000")
public class CategoryController {

    private final CategoryService categoryService; // 카테고리 관련 비즈니스 로직
    private final GameService gameService; // 게임 관련 로직 (다중 필터와 검색)

    @Autowired
    public CategoryController(CategoryService categoryService, GameService gameService) {
        this.categoryService = categoryService;
        this.gameService = gameService;
    }

    // 1. 모든 카테고리 조회
    // HTTP GET 요청: /category
    // @return 모든 카테고리를 CategoryDTO 리스트 형태로 반환
    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategories().stream()
                .map(category -> new ModelMapper().map(category, CategoryDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(categories);
    }

    // 2. 특정 카테고리의 게임 목록 조회
    // HTTP GET 요청: /category/{id}/games
    // @param id 카테고리 ID
    // @return 해당 카테고리에 속한 게임 리스트(GameDTO)
    @GetMapping("/{id}/games")
    public ResponseEntity<List<GameDTO>> getGamesByCategory(@PathVariable Long id) {
        List<GameDTO> games = categoryService.getGamesByCategory(id);
        return ResponseEntity.ok(games);
    }

    // 3. 다중 필터 및 검색 기능을 추가한 게임 조회
    // HTTP GET 요청: /category/games
    // @param genre 장르 필터 (옵션)
    // @param minPrice 최소 가격 필터 (옵션)
    // @param maxPrice 최대 가격 필터 (옵션)
    // @param minDiscount 최소 할인율 필터 (옵션)
    // @param releaseYear 출시 연도 필터 (옵션)
    // @param search 검색 키워드 (옵션)
    // @return 조건에 맞는 게임 리스트 (GameDTO)
    @GetMapping("/games")
    public ResponseEntity<List<GameDTO>> filterAndSearchGames(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam(required = false) String search
    ) {
        // GameService의 filterAndSearchGames 메서드를 호출하여 결과를 가져옴
        List<GameDTO> games = gameService.filterAndSearchGames(genre, minPrice, maxPrice, minDiscount, releaseYear, search);
        return ResponseEntity.ok(games);
    }

    // 4. 개별 게임 세부 정보 조회
    @GetMapping("/games/{appId}")
    public ResponseEntity<?> getGameById(@PathVariable Long appId) {
        GameDTO game = gameService.findGameById(appId);
        if (game != null) {
            return ResponseEntity.ok(game);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("해당 게임 정보를 찾을 수 없습니다.");
        }
    }
}
