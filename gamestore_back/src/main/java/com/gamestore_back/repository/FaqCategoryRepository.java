package com.gamestore_back.repository;

import com.gamestore_back.domain.FaqCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqCategoryRepository extends JpaRepository<FaqCategory, Long> {
}
