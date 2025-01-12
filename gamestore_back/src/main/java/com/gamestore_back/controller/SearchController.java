package com.gamestore_back.controller;

import com.gamestore_back.dto.GameDTO;
import com.gamestore_back.service.GameService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class SearchController {

    private final GameService gameService;
    private final ModelMapper modelMapper;

    /**
     * 모든 게임 리스트 조회
     *
     * @return 게임 리스트
     */
    @GetMapping
    public ResponseEntity<List<GameDTO>> getAllGames() {
        List<GameDTO> games = gameService.getAllGames().stream()
                .map(game -> modelMapper.map(game, GameDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(games);
    }

    /**
     * 특정 게임 조회 (ID로 검색)
     *
     * @param appId 게임 ID
     * @return 게임 상세 정보
     */
    @GetMapping("/{appId}")
    public ResponseEntity<GameDTO> getGameById(@PathVariable Long appId) {
        try {
            GameDTO game = gameService.findGameById(appId);
            return ResponseEntity.ok(game);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 게임 이름으로 검색
     *
     * @param name 검색할 게임 이름
     * @return 게임 검색 결과 리스트
     */
    @GetMapping("/search")
    public ResponseEntity<List<GameDTO>> searchGames(@RequestParam("query") String query) {
        List<GameDTO> results = gameService.searchGamesByName(query);
        return ResponseEntity.ok(results);
    }
        /**
     * 게임 필터 및 검색
     *
     * @param genre       장르 필터
     * @param minPrice    최소 가격
     * @param maxPrice    최대 가격
     * @param minDiscount 최소 할인율
     * @param releaseYear 출시 연도
     * @param search      검색 키워드
     * @return 필터 및 검색 결과 리스트
     */
    @GetMapping("/filter")
    public ResponseEntity<List<GameDTO>> filterAndSearchGames(
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minDiscount,
            @RequestParam(required = false) Integer releaseYear,
            @RequestParam(required = false) String search
    ) {
        List<GameDTO> games = gameService.filterAndSearchGames(
                genre, minPrice, maxPrice, minDiscount, releaseYear, search);
        return ResponseEntity.ok(games);
    }

    /**
     * Steam API를 통해 인기 게임 데이터를 가져와 저장
     *
     * @return 성공 메시지
     */
    @PostMapping("/fetch/popular")
    public ResponseEntity<String> fetchAndSavePopularGames() {
        gameService.fetchAndSavePopularGames();
        return ResponseEntity.ok("인기 게임 데이터를 성공적으로 저장했습니다.");
    }

    /**
     * Steam API를 통해 게임 세부 정보를 업데이트
     *
     * @return 성공 메시지
     */
    @PostMapping("/fetch/details")
    public ResponseEntity<String> fetchAndSaveGameDetails() {
        gameService.fetchAndSaveGameDetails();
        return ResponseEntity.ok("게임 세부 정보 업데이트가 완료되었습니다.");
    }
}
