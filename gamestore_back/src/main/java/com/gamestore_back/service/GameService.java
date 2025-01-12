package com.gamestore_back.service;

import com.gamestore_back.domain.Game;
import com.gamestore_back.dto.GameDTO;

import java.math.BigDecimal;
import java.util.List;

public interface GameService {

    // Steam API를 호출하여 인기 있는 게임 데이터를 가져와 DB에 저장
    void fetchAndSavePopularGames();

    // Steam Store Data API를 호출하여 특정 게임의 세부 정보를 가져오고 DB에 저장
    void fetchAndSaveGameDetails();

    // DB에 저장된 모든 게임 데이터를 조회
    List<Game> getAllGames();

    // 다중 필터 및 검색 조건으로 게임 리스트를 조회합니다.
    // @param genre       장르 필터
    // @param minPrice    최소 가격 필터
    // @param maxPrice    최대 가격 필터
    // @param minDiscount 최소 할인율 필터
    // @param releaseYear 출시 연도 필터
    // @param search      검색 키워드
    List<GameDTO> filterAndSearchGames(String genre, BigDecimal minPrice, BigDecimal maxPrice, Integer minDiscount, Integer releaseYear, String search);

    // 단일 게임 세부 정보를 조회
    // @param appId 게임 ID
    GameDTO findGameById(Long appId); // 새로 추가된 메서드

    // 추가: game_name으로 검색
    List<GameDTO> searchGamesByName(String gameName);
}