package com.gamestore_back.service;

import com.gamestore_back.dto.ReviewDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewService {

    // 리뷰 작성
    ReviewDTO createReview(ReviewDTO reviewDTO);

    // 특정 게임의 리뷰를 페이징 처리하여 가져옵니다.
    Page<ReviewDTO> getReviewsByGame(Long appId, Pageable pageable);

    // 특정 게임의 전체 리뷰 가져오기
    double getAverageRatingByGame(Long appId);

    // 특정 게임의 리뷰 목록 조회
    List<ReviewDTO> getReviewsByGame(Long appId);

    // 특정 사용자의 리뷰 목록 조회
    List<ReviewDTO> getReviewsByPlayer(String email);

    // 특정 게임과 특정 사용자의 리뷰 조회
    ReviewDTO getReviewByGameAndPlayer(Long appId, String email);

    // 리뷰 수정
    ReviewDTO updateReview(Long reviewId, ReviewDTO reviewDTO);

    // 리뷰 삭제
    void deleteReview(Long reviewId);

    // 좋아요 증가
    void incrementLikeCount(Long reviewId);

    // 싫어요 증가
    void incrementDislikeCount(Long reviewId);
}
