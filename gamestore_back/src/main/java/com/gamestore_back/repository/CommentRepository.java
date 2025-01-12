//package com.gamestore_back.repository;
//
//import com.gamestore_back.domain.Comment;
//import org.springframework.data.jpa.repository.JpaRepository;
//
//public interface CommentRepository extends JpaRepository<Comment, Long> {
//}
package com.gamestore_back.repository;

import com.gamestore_back.domain.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 특정 뉴스 ID로 댓글 조회 및 정렬
    Page<Comment> findByNewsIdOrderByCreatedAtDesc(Long newsId, Pageable pageable);

    // 특정 뉴스 ID의 댓글 개수 조회
    Long countByNewsId(Long newsId);
}