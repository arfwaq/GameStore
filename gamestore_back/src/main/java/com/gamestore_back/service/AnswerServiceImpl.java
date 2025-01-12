package com.gamestore_back.service;

import com.gamestore_back.domain.Answer;
import com.gamestore_back.domain.Inquiry;
import com.gamestore_back.dto.AnswerDTO;
import com.gamestore_back.repository.AnswerRepository;
import com.gamestore_back.repository.InquiryRepository;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Log4j2
@Service
@Transactional
public class AnswerServiceImpl implements AnswerService {

    private final AnswerRepository answerRepository;
    private final InquiryRepository inquiryRepository;

    public AnswerServiceImpl(AnswerRepository answerRepository, InquiryRepository inquiryRepository) {
        this.answerRepository = answerRepository;
        this.inquiryRepository = inquiryRepository;
    }

    // 답변 등록
    @Override
    public AnswerDTO saveAnswer(AnswerDTO answerDTO) { // 반환 타입 수정
        Inquiry inquiry = inquiryRepository.findById(answerDTO.getInquiryId())
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 존재하지 않습니다."));

        Answer answer = new Answer(inquiry, answerDTO.getContent());
        Answer savedAnswer = answerRepository.save(answer); // 저장 후 반환된 엔티티 사용

        return entityToDTO(savedAnswer); // 엔티티를 DTO로 변환하여 반환
    }

    // 특정 문의에 대한 답변 목록 조회
    @Override
    public List<AnswerDTO> getAnswersByInquiryId(Long inquiryId) {
        List<Answer> answers = answerRepository.findByInquiryId(inquiryId);
        return answers.stream().map(this::entityToDTO).toList();
    }

    // 특정 답변 조회
    @Override
    public Optional<AnswerDTO> getAnswerById(Long id) {
        return answerRepository.findById(id).map(this::entityToDTO);
    }

    // 답변 삭제
    @Override
    public void deleteAnswer(Long id) {
        if (!answerRepository.existsById(id)) {
            throw new IllegalArgumentException("해당 답변이 존재하지 않습니다.");
        }
        answerRepository.deleteById(id);
    }

    // 답변 수정
    @Override
    public AnswerDTO updateAnswer(Long id, AnswerDTO answerDTO) {
        Answer existingAnswer = answerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 답변이 존재하지 않습니다."));

        // 기존 엔티티를 수정
        existingAnswer.updateContent(answerDTO.getContent());

        Answer updatedAnswer = answerRepository.save(existingAnswer); // 수정된 엔티티 저장
        return entityToDTO(updatedAnswer); // 수정된 엔티티를 DTO로 변환하여 반환
    }



    // 엔티티를 DTO로 변환
    private AnswerDTO entityToDTO(Answer answer) {
        return AnswerDTO.builder()
                .id(answer.getId())
                .inquiryId(answer.getInquiry().getId())
                .content(answer.getContent())
                .createdAt(answer.getRegDate().toString())
                .updatedAt(answer.getModDate().toString())
                .build();
    }

    // DTO to Entity 매핑
    private Answer dtoToEntity(AnswerDTO dto) {
        Inquiry inquiry = inquiryRepository.findById(dto.getInquiryId())
                .orElseThrow(() -> new IllegalArgumentException("해당 문의가 존재하지 않습니다."));

        return Answer.builder()
                .id(dto.getId()) // 기존 ID를 유지하려면 필요
                .inquiry(inquiry)
                .content(dto.getContent())
                .build();
    }
}
