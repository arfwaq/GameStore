package com.gamestore_back.repository;

import com.gamestore_back.domain.Review;
import com.gamestore_back.domain.Game;
import com.gamestore_back.domain.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // 특정 게임의 모든 리뷰 조회
    List<Review> findByGame(Game game);

    // 특정 사용자가 작성한 모든 리뷰 조회
    List<Review> findByPlayer(Player player);

    // 특정 게임과 특정 사용자의 리뷰를 조회(유니크한 경우를 상정)
    Review findByGameAndPlayer(Game game, Player player);

    // 특정 게임의 리뷰를 페이징 처리하여 조회
    Page<Review> findByGame(Game game, Pageable pageable);
}
