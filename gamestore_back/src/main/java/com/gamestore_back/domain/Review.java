package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    private Long reviewId; // 리뷰 ID

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "email", nullable = false)
    private Player player; // Player의 email과 매핑
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "app_id", nullable = false)
    private Game game; // Game 객체와 매핑

    @Column(name = "review_content", nullable = false, length = 1000)
    private String reviewContent; // 리뷰 내용

    @Column(name = "review_rating", nullable = false)
    private Integer reviewRating; // 리뷰 평점

    @CreatedDate
    @Column(name = "created_date", updatable = false, nullable = false)
    private LocalDateTime createdDate; // 작성 날짜

    @Column(name = "review_like_count", nullable = false)
    private Integer reviewLikeCount = 0; // 좋아요 수

    @Column(name = "review_dislike_count", nullable = false)
    private Integer reviewDislikeCount = 0; // 싫어요 수
}
