package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "game_news")
@Getter
@Setter
public class GameNews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "app_id", nullable = false)
    private long appId; // long 타입으로 변경

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String contents;

    private String url;

    @Column(nullable = true) // null 허용
    private String image; // 이미지 URL 필드 추가

    private LocalDateTime publishDate;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer recommends = 0; // 추천 수

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer downvotes = 0; // 비추천 수

    @Column(name = "comment_count", nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer commentCount = 0; // 댓글 수 (DB와 매핑)

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        if (recommends == null) recommends = 0;
        if (downvotes == null) downvotes = 0;
        if (commentCount == null) commentCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
