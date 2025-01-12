package com.gamestore_back.controller;

import com.gamestore_back.dto.ReviewDTO;
import com.gamestore_back.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews") // API 경로를 "/api/reviews"로 설정
@RequiredArgsConstructor // 생성자를 자동으로 생성
@Validated // 클래스 레벨 Validation 활성화
public class ReviewController {

    private final ReviewService reviewService; // ReviewService 의존성을 주입

    /**
     * 특정 게임의 리뷰 목록을 가져옵니다.
     * @param appId 게임 ID
     * @return 게임 리뷰 목록
     */
        @GetMapping("/game/{appId}") // HTTP GET 요청을 "/api/reviews/game/{appId}"에서 처리
    public ResponseEntity<List<ReviewDTO>> getReviewsByGame(@PathVariable Long appId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByGame(appId); // 게임 ID로 리뷰 목록 조회
        return ResponseEntity.ok(reviews); // 200 OK와 함께 리뷰 목록 반환
    }

    @GetMapping("/game/{appId}/paged")
    public ResponseEntity<Page<ReviewDTO>> getPagedReviewsByGame(
            @PathVariable Long appId,
            Pageable pageable) {
        Page<ReviewDTO> pagedReviews = reviewService.getReviewsByGame(appId, pageable); // 이름 맞추기
        return ResponseEntity.ok(pagedReviews); // 200 OK와 함께 페이징된 리뷰 목록 반환
    }

    // 특정 게임의 모든 리뷰 가져오기
    @GetMapping("/game/{appId}/average-rating")
    public ResponseEntity<Double> getAverageRatingByGame(@PathVariable Long appId) {
        double averageRating = reviewService.getAverageRatingByGame(appId);
        return ResponseEntity.ok(averageRating);
    }

    /**
     * 새로운 리뷰를 생성합니다.
     * @param reviewDTO 생성할 리뷰 데이터
     * @return 생성된 리뷰의 정보
     */
    @PostMapping
    public ResponseEntity<ReviewDTO> createReview(@Valid @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO createdReview = reviewService.createReview(reviewDTO); // 리뷰 생성
        return ResponseEntity.ok(createdReview); // 200 OK와 함께 생성된 리뷰 반환
    }

    /**
     * 특정 사용자의 리뷰 목록을 가져옵니다.
     * @param email 사용자 이메일
     * @return 사용자의 리뷰 목록
     */
    @GetMapping("/user/{email}") // HTTP GET 요청을 "/api/reviews/user/{email}"에서 처리
    public ResponseEntity<List<ReviewDTO>> getReviewsByUser(@PathVariable String email) {
        List<ReviewDTO> reviews = reviewService.getReviewsByPlayer(email); // 사용자 이메일로 리뷰 목록 조회
        return ResponseEntity.ok(reviews); // 200 OK와 함께 리뷰 목록 반환
    }

    /**
     * 특정 게임에서 특정 사용자가 작성한 리뷰를 가져옵니다.
     * @param appId 게임 ID
     * @param email 사용자 이메일
     * @return 해당 사용자의 리뷰
     */
    @GetMapping("/game/{appId}/user/{email}") // HTTP GET 요청을 "/api/reviews/game/{appId}/user/{email}"에서 처리
    public ResponseEntity<ReviewDTO> getReviewByGameAndUser(
            @PathVariable Long appId,
            @PathVariable String email) {
        ReviewDTO review = reviewService.getReviewByGameAndPlayer(appId, email); // 게임 ID와 사용자 이메일로 리뷰 조회
        return ResponseEntity.ok(review); // 200 OK와 함께 리뷰 반환
    }

    /**
     * 리뷰를 수정합니다.
     * @param reviewId 수정할 리뷰 ID
     * @param reviewDTO 수정할 리뷰 데이터
     * @return 수정된 리뷰 정보
     */
    @PutMapping("/{reviewId}") // HTTP PUT 요청을 "/api/reviews/{reviewId}"에서 처리
    public ResponseEntity<ReviewDTO> updateReview(
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO updatedReview = reviewService.updateReview(reviewId, reviewDTO); // 리뷰 업데이트
        return ResponseEntity.ok(updatedReview); // 200 OK와 함께 수정된 리뷰 반환
    }

    /**
     * 특정 리뷰를 삭제합니다.
     * @param reviewId 삭제할 리뷰의 ID
     * @return 성공 메시지 또는 상태 코드
     */
    @DeleteMapping("/{reviewId}") // HTTP DELETE 요청을 "/api/reviews/{reviewId}"에서 처리
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId); // reviewId로 리뷰 삭제
        return ResponseEntity.noContent().build(); // 204 No Content 응답 반환
    }

    /**
     * 특정 리뷰의 좋아요 수를 증가시킵니다.
     * @param reviewId 리뷰 ID
     * @return 성공 메시지
     */
    @PatchMapping("/{reviewId}/like")
    public ResponseEntity<String> incrementLikeCount(@PathVariable Long reviewId) {
        reviewService.incrementLikeCount(reviewId); // 서비스 메서드 호출
        return ResponseEntity.ok("Like count incremented successfully.");
    }

    /**
     * 특정 리뷰의 싫어요 수를 증가시킵니다.
     * @param reviewId 리뷰 ID
     * @return 성공 메시지
     */
    @PatchMapping("/{reviewId}/dislike")
    public ResponseEntity<String> incrementDislikeCount(@PathVariable Long reviewId) {
        reviewService.incrementDislikeCount(reviewId); // 서비스 메서드 호출
        return ResponseEntity.ok("Dislike count incremented successfully.");
    }
}
