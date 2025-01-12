package com.gamestore_back.repository;

import com.gamestore_back.domain.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AnswerRepository extends JpaRepository<Answer, Long> {

    // 특정 문의에 대한 답변 목록 조회 (inquiry_id 기준)
    List<Answer> findByInquiryId(Long inquiryId);

    // 특정 답변 조회 (id 기준)
    Optional<Answer> findById(Long id);

    // 특정 답변 삭제
    void deleteById(Long id);

}
