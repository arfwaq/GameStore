package com.gamestore_back.controller;

import com.gamestore_back.domain.Answer;
import com.gamestore_back.dto.AnswerDTO;
import com.gamestore_back.service.AnswerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    // 특정 문의에 대한 답변 목록 조회 (USER, ADMIN 둘 다 가능)
    @GetMapping("/inquiries/{inquiryId}/answers")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<List<AnswerDTO>> getAnswersByInquiryId(@PathVariable Long inquiryId) {
        List<AnswerDTO> answers = answerService.getAnswersByInquiryId(inquiryId);
        return ResponseEntity.ok(answers);
    }

    // 특정 답변 조회 (USER, ADMIN 둘 다 가능)
    @GetMapping("/answers/{answerId}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<AnswerDTO> getAnswerById(@PathVariable Long answerId) {
        return answerService.getAnswerById(answerId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // 답변 등록 (ADMIN만 가능)
    @PostMapping("/answers/{inquiryId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AnswerDTO> createAnswer(@PathVariable Long inquiryId, @RequestBody AnswerDTO answerDTO) {
        answerDTO.setInquiryId(inquiryId);
        AnswerDTO savedAnswer = answerService.saveAnswer(answerDTO);
        return ResponseEntity.ok(savedAnswer); // 저장된 답변 반환
    }

    // 답변 수정 (ADMIN만 가능)
    @PutMapping("/answers/{answerId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<AnswerDTO> updateAnswer(@PathVariable Long answerId, @RequestBody AnswerDTO answerDTO) {
        log.info("수정 요청 데이터: {}", answerDTO.getContent());
        AnswerDTO updatedAnswer = answerService.updateAnswer(answerId, answerDTO);
        log.info("컨트롤러에서 업데이트된 답변: {}", updatedAnswer.getContent());
        return ResponseEntity.ok(updatedAnswer);
    }

    // 답변 삭제 (ADMIN만 가능)
    @DeleteMapping("/answers/{answerId}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> deleteAnswer(@PathVariable Long answerId) {
        answerService.deleteAnswer(answerId);
        return ResponseEntity.ok("답변 삭제 성공");
    }
}
