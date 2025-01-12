//package com.gamestore_back.controller;
//
//import com.gamestore_back.domain.Game;
//import com.gamestore_back.service.GameService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/games")
//public class GameController {
//
//    private final GameService gameService;
//
//    @Autowired
//    public GameController(GameService gameService) {
//        this.gameService = gameService;
//    }
//
//    @GetMapping
//    public List<Game> getGames() {
//        return gameService.getAllGames(); // 모든 게임 조회
//    }
//
//    @PostMapping
//    public Game createGame(@RequestBody Game game) {
//        return gameService.saveGame(game); // 게임 생성
//    }
//}
