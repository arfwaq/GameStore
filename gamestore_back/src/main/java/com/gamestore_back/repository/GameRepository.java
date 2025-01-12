package com.gamestore_back.repository;

import com.gamestore_back.domain.Game;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {

    // 게임 ID로 중복 확인
    boolean existsByAppId(Long gameId);

    // 다중 필터 및 검색 조건으로 게임 데이터를 조회
    @Query("SELECT g FROM Game g " +
            "WHERE (:genre IS NULL OR g.genre LIKE %:genre%) " + // 장르 필터
            "AND (:minPrice IS NULL OR g.price >= :minPrice) " + // 최소 가격 필터
            "AND (:maxPrice IS NULL OR g.price <= :maxPrice) " + // 최대 가격 필터
            "AND (:minDiscount IS NULL OR g.discountRate >= :minDiscount) " + // 최소 할인율 필터
            "AND (:releaseYear IS NULL OR FUNCTION('YEAR', g.releaseDate) = :releaseYear) " + // 출시 연도 필터
            "AND (:search IS NULL OR LOWER(g.gameName) LIKE LOWER(CONCAT('%', :search, '%')))") // 검색 키워드 필터
    List<Game> filterAndSearchGames(
            @Param("genre") String genre,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minDiscount") Integer minDiscount,
            @Param("releaseYear") Integer releaseYear,
            @Param("search") String search
    );
    // 추가: game_name으로 검색
    List<Game> findByGameNameContainingIgnoreCase(String gameName);
}

