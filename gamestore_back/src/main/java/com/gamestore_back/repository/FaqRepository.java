package com.gamestore_back.repository;

import com.gamestore_back.domain.Faq;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


public interface FaqRepository extends JpaRepository<Faq, Long> {



    // 카테고리별 FAQ 조회
    Page<Faq> findByCategoryId(Long categoryId, Pageable pageable);

}
