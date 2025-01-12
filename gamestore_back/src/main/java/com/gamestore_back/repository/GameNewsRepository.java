package com.gamestore_back.repository;

import com.gamestore_back.domain.GameNews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GameNewsRepository extends JpaRepository<GameNews, Long> {

    Page<GameNews> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Page<GameNews> findAllByOrderByRecommendsDesc(Pageable pageable);

    Page<GameNews> findAllByOrderByDownvotesDesc(Pageable pageable);

    Page<GameNews> findAllByOrderByCommentCountDesc(Pageable pageable);
}
