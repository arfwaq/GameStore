package com.gamestore_back.service;

import com.gamestore_back.dto.AnswerDTO;

import java.util.List;
import java.util.Optional;

public interface AnswerService {

    // 답변 등록
    AnswerDTO saveAnswer(AnswerDTO answerDTO);

    // 특정 문의에 대한 답변 목록 조회
    List<AnswerDTO> getAnswersByInquiryId(Long inquiryId);

    // 특정 답변 조회
    Optional<AnswerDTO> getAnswerById(Long id);

    // 답변 삭제
    void deleteAnswer(Long id);

    // 답변 수정
    AnswerDTO updateAnswer(Long id, AnswerDTO answerDTO);
}
