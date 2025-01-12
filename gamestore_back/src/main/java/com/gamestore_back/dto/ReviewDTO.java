package com.gamestore_back.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDTO {

    private Long reviewId;           // 리뷰 고유 ID

    @Email(message = "Email should be valid")
    private String email;            // 작성자 이메일 (PlayerDTO와 일치)

    @NotNull(message = "Game ID is required")
    private Long appId;              // 게임 ID (GameDTO와 일치)

    @NotBlank(message = "Review content cannot be empty")
    private String reviewContent;    // 리뷰 내용

    @NotNull(message = "Review rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot be more than 5")
    private Integer reviewRating;    // 평점

    private LocalDateTime createdDate; // 작성 날짜

    private Integer reviewLikeCount; // 좋아요 수

    private Integer reviewDislikeCount; // 싫어요 수
}

