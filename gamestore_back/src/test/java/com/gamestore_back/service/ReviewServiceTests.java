package com.gamestore_back.service;

import com.gamestore_back.domain.Game;
import com.gamestore_back.domain.Player;
import com.gamestore_back.dto.ReviewDTO;
import com.gamestore_back.repository.GameRepository;
import com.gamestore_back.repository.PlayerRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Log4j2
public class ReviewServiceTests {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Test
    public void testCreateReview() {
        // Given: 리뷰 작성 DTO 준비
        Long appId = gameRepository.findAll().stream().skip(4).findFirst()
                .map(Game::getAppId)
                .orElseThrow(() -> new IllegalArgumentException("No games found in the database."));

        String email = playerRepository.findAll().stream().findFirst()
                .map(Player::getEmail)
                .orElseThrow(() -> new IllegalArgumentException("No players found in the database."));

        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setAppId(appId);
        reviewDTO.setEmail(email);
        reviewDTO.setReviewContent("This is a test review.");
        reviewDTO.setReviewRating(5);

        // When: 리뷰 생성
        ReviewDTO createdReview = reviewService.createReview(reviewDTO);
    }

    @Test
    public void testRetrieveReviewsByGame() {
        // Given: 게임 ID 가져오기
        Long appId = gameRepository.findAll().stream().findFirst()
                .map(Game::getAppId)
                .orElseThrow(() -> new IllegalArgumentException("No games found in the database."));

        // When: 특정 게임의 리뷰 목록 조회
        var reviews = reviewService.getReviewsByGame(appId);

        // Then: 검증
        assertNotNull(reviews);
        assertFalse(reviews.isEmpty(), "No reviews found for the game.");
        reviews.forEach(review -> assertEquals(appId, review.getAppId()));
        log.info("Reviews retrieved successfully for appId: " + appId);
    }

    @Test
    public void testDeleteReview() {
        // Given: 리뷰 생성 후 ID 가져오기
        Long appId = gameRepository.findAll().stream().skip(1).findFirst()
                .map(Game::getAppId)
                .orElseThrow(() -> new IllegalArgumentException("No games found in the database."));

        String email = playerRepository.findAll().stream().findFirst()
                .map(Player::getEmail)
                .orElseThrow(() -> new IllegalArgumentException("No players found in the database."));

        ReviewDTO reviewDTO = new ReviewDTO();
        reviewDTO.setAppId(appId);
        reviewDTO.setEmail(email);
        reviewDTO.setReviewContent("Review to be deleted.");
        reviewDTO.setReviewRating(4);
        ReviewDTO createdReview = reviewService.createReview(reviewDTO);

        Long reviewId = createdReview.getReviewId();
        assertNotNull(reviewId);

        // When: 리뷰 삭제
        reviewService.deleteReview(reviewId);

        // Then: 삭제된 리뷰가 없는지 검증
        var reviews = reviewService.getReviewsByGame(appId);
        assertTrue(reviews.stream().noneMatch(r -> r.getReviewId().equals(reviewId)), "Review was not deleted.");
        log.info("Review deleted successfully for reviewId: " + reviewId);
    }

    @Test
    public void testUpdateReview() {
        // Given: 기존 리뷰 데이터 가져오기
        Long appId = gameRepository.findAll().stream().findFirst()
                .map(Game::getAppId)
                .orElseThrow(() -> new IllegalArgumentException("No games found in the database."));

        String email = playerRepository.findAll().stream().findFirst()
                .map(Player::getEmail)
                .orElseThrow(() -> new IllegalArgumentException("No players found in the database."));

        // Assume a review exists for the game and user
        ReviewDTO existingReview = reviewService.getReviewsByGame(appId).stream()
                .filter(r -> r.getEmail().equals(email))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No reviews found for this user and game."));

        // When: 리뷰 수정
        Long reviewId = existingReview.getReviewId(); // Extract the review ID
        ReviewDTO updatedData = new ReviewDTO();
        updatedData.setReviewContent("Updated review content."); // New content
        updatedData.setReviewRating(3); // New rating

        ReviewDTO updatedReview = reviewService.updateReview(reviewId, updatedData);

        // Then: 수정된 내용 검증
        assertNotNull(updatedReview);
        assertEquals("Updated review content.", updatedReview.getReviewContent());
        assertEquals(3, updatedReview.getReviewRating());
        assertEquals(reviewId, updatedReview.getReviewId(), "Review ID should remain the same.");
    }


}
