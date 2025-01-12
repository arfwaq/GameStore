package com.gamestore_back.service;

import com.gamestore_back.domain.Game;
import com.gamestore_back.repository.GameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class GameServiceTests {

    @Autowired
    private GameService gameService;

    @Autowired
    private GameRepository gameRepository;

    @BeforeEach
    public void setUp() {
        // 테이블 초기화
        gameRepository.deleteAll();
        System.out.println("테이블 초기화 완료.");
    }

    @Test
    public void testFetchAndSavePopularGames() {
        System.out.println("크롤링 작업 테스트를 시작합니다...");
        gameService.fetchAndSavePopularGames(); // 크롤링 및 저장 실행

        // 저장된 데이터 확인
        List<Game> savedGames = gameRepository.findAll();
        System.out.println("총 저장된 게임 수: " + savedGames.size());

        savedGames.forEach(game ->
                System.out.println("저장된 게임 - ID: " + game.getAppId() + ", 이름: " + game.getGameName())
        );
    }

    @Test
    public void testFetchAndSaveGameDetails() {
        System.out.println("Steam Store Data API에서 세부 정보를 가져오는 테스트를 시작합니다...");
        gameService.fetchAndSavePopularGames(); // 먼저 인기 게임 저장
        gameService.fetchAndSaveGameDetails(); // 세부 정보 업데이트

        // 데이터 확인
        List<Game> games = gameRepository.findAll();
        System.out.println("업데이트된 게임 수: " + games.size());
        games.forEach(game -> System.out.println("게임 ID: " + game.getAppId() + ", 이름: " + game.getGameName()));
    }
}