package com.gamestore_back.service;

import com.gamestore_back.domain.Comment;
import org.springframework.data.domain.Page;

public interface CommentService {

    Comment createComment(Long newsId, String username, String content);

    Page<Comment> getCommentsByNewsId(Long newsId, int page, int size);

    void addLike(Long commentId);

    void addDislike(Long commentId);

    void updateComment(Long commentId, String updatedContent);

    void deleteComment(Long commentId);

    void resetCommentCounts();

    // 댓글 개수 조회 메서드 추가
    Long getCommentCountByNewsId(Long newsId);
}
