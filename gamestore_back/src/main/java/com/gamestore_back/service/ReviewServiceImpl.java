package com.gamestore_back.service;

import com.gamestore_back.domain.Game;
import com.gamestore_back.domain.Player;
import com.gamestore_back.domain.Review;
import com.gamestore_back.dto.ReviewDTO;
import com.gamestore_back.repository.GameRepository;
import com.gamestore_back.repository.PlayerRepository;
import com.gamestore_back.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;
    private final ModelMapper modelMapper;

    // 특정 게임의 리뷰 목록을 페이징 처리
    @Override
    public Page<ReviewDTO> getReviewsByGame(Long appId, Pageable pageable) {
        Game game = gameRepository.findById(appId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found with ID: " + appId));

        return reviewRepository.findByGame(game, pageable)
                .map(review -> modelMapper.map(review, ReviewDTO.class));
    }

    // 특정 게임의 전체 리뷰 처리
    @Override
    public double getAverageRatingByGame(Long appId) {
        Game game = gameRepository.findById(appId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found with ID: " + appId));

        List<Review> reviews = reviewRepository.findByGame(game);

        if (reviews.isEmpty()) {
            return 0.0;
        }

        double totalRating = reviews.stream()
                .mapToDouble(Review::getReviewRating)
                .sum();

        return totalRating / reviews.size();
    }

    // 특정 게임의 모든 리뷰 목록 (페이징이 필요 없는 경우 사용)
    @Override
    public List<ReviewDTO> getReviewsByGame(Long appId) {
        Game game = gameRepository.findById(appId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found with ID: " + appId));

        return reviewRepository.findByGame(game).stream()
                .map(review -> modelMapper.map(review, ReviewDTO.class))
                .collect(Collectors.toList());
    }

    // 특정 사용자가 작성한 모든 리뷰
    @Override
    public List<ReviewDTO> getReviewsByPlayer(String email) {
        Player player = playerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with email: " + email));

        return reviewRepository.findByPlayer(player).stream()
                .map(review -> modelMapper.map(review, ReviewDTO.class))
                .collect(Collectors.toList());
    }

    // 특정 게임과 특정 사용자의 리뷰를 조회
    @Override
    public ReviewDTO getReviewByGameAndPlayer(Long appId, String email) {
        Game game = gameRepository.findById(appId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found with ID: " + appId));
        Player player = playerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with email: " + email));

        Review review = reviewRepository.findByGameAndPlayer(game, player);
        if (review == null) {
            throw new IllegalArgumentException("Review not found for this game by the user.");
        }

        return modelMapper.map(review, ReviewDTO.class);
    }

    // 새로운 리뷰를 생성
    @Override
    public ReviewDTO createReview(ReviewDTO reviewDTO) {
        Game game = gameRepository.findById(reviewDTO.getAppId())
                .orElseThrow(() -> new IllegalArgumentException("Game not found with ID: " + reviewDTO.getAppId()));
        Player player = playerRepository.findByEmail(reviewDTO.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Player not found with email: " + reviewDTO.getEmail()));

        if (reviewRepository.findByGameAndPlayer(game, player) != null) {
            throw new IllegalArgumentException("Review already exists for this game by the user.");
        }

        Review review = Review.builder()
                .game(game)
                .player(player)
                .reviewContent(reviewDTO.getReviewContent())
                .reviewRating(reviewDTO.getReviewRating())
                .reviewLikeCount(0)
                .reviewDislikeCount(0)
                .build();
        reviewRepository.save(review);

        return modelMapper.map(review, ReviewDTO.class);
    }

    // 특정 리뷰를 수정
    @Override
    public ReviewDTO updateReview(Long reviewId, ReviewDTO reviewDTO) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with ID: " + reviewId));

        review.setReviewContent(reviewDTO.getReviewContent());
        review.setReviewRating(reviewDTO.getReviewRating());
        reviewRepository.save(review);

        return modelMapper.map(review, ReviewDTO.class);
    }

    // 특정 리뷰를 삭제
    @Override
    public void deleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with ID: " + reviewId));

        reviewRepository.delete(review);
    }

    // 특정 리뷰의 좋아요 수를 증가
    @Override
    public void incrementLikeCount(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with ID: " + reviewId));

        review.setReviewLikeCount(review.getReviewLikeCount() + 1);
        reviewRepository.save(review);
    }

    // 특정 리뷰의 싫어요 수를 증가
    @Override
    public void incrementDislikeCount(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with ID: " + reviewId));

        review.setReviewDislikeCount(review.getReviewDislikeCount() + 1);
        reviewRepository.save(review);
    }
}
