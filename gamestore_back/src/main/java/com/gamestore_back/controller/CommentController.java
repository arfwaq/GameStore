package com.gamestore_back.controller;

import com.gamestore_back.domain.Comment;
import com.gamestore_back.dto.CommentDTO;
import com.gamestore_back.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000")
public class CommentController {

    @Autowired
    private CommentService commentService;

    // 댓글 작성
    @PostMapping("/news/{newsId}")
    public ResponseEntity<?> createComment(@PathVariable Long newsId, @RequestBody CommentDTO commentDTO) {
        try {
            Comment savedComment = commentService.createComment(newsId, commentDTO.getUsername(), commentDTO.getContent());
            return ResponseEntity.status(HttpStatus.CREATED).body(savedComment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add comment", "message", e.getMessage()));
        }
    }

    // 특정 뉴스에 대한 댓글 조회
    @GetMapping("/news/{newsId}")
    public ResponseEntity<?> getCommentsByNewsId(
            @PathVariable Long newsId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        try {
            Page<Comment> comments = commentService.getCommentsByNewsId(newsId, page, size);
            return ResponseEntity.ok(comments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch comments", "message", e.getMessage()));
        }
    }

    // 댓글 수정
    @PatchMapping("/{commentId}")
    public ResponseEntity<?> updateComment(@PathVariable Long commentId, @RequestBody Map<String, String> payload) {
        try {
            String updatedContent = payload.get("content");
            if (updatedContent == null || updatedContent.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "Content cannot be empty"));
            }
            commentService.updateComment(commentId, updatedContent);
            return ResponseEntity.ok(Map.of("message", "Comment updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update comment", "message", e.getMessage()));
        }
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete comment", "message", e.getMessage()));
        }
    }

    // 댓글 좋아요 추가
    @PatchMapping("/{commentId}/like")
    public ResponseEntity<?> addLike(@PathVariable Long commentId) {
        try {
            commentService.addLike(commentId);
            return ResponseEntity.ok(Map.of("message", "Like added successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add like", "message", e.getMessage()));
        }
    }

    // 댓글 싫어요 추가
    @PatchMapping("/{commentId}/dislike")
    public ResponseEntity<?> addDislike(@PathVariable Long commentId) {
        try {
            commentService.addDislike(commentId);
            return ResponseEntity.ok(Map.of("message", "Dislike added successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to add dislike", "message", e.getMessage()));
        }
    }

    // 댓글 개수 조회 (추가 기능)
    @GetMapping("/news/{newsId}/count")
    public ResponseEntity<?> getCommentCountByNewsId(@PathVariable Long newsId) {
        try {
            Long commentCount = commentService.getCommentCountByNewsId(newsId);
            return ResponseEntity.ok(Map.of("commentCount", commentCount));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch comment count", "message", e.getMessage()));
        }
    }

}
