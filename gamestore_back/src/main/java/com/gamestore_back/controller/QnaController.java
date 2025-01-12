package com.gamestore_back.controller;

import com.gamestore_back.dto.InquiryDTO;
import com.gamestore_back.service.QnaService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qna")
@RequiredArgsConstructor
public class QnaController {

    private final QnaService qnaService;

    // 특정 사용자의 문의 페이징 조회
    @GetMapping("/my-inquiries")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<Page<InquiryDTO>> getMyInquiries(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page, // 기본값: 0
            @RequestParam(defaultValue = "10") int size // 기본값: 10
    ) {
        String email = authentication.getName(); // 인증된 사용자의 이메일
        Page<InquiryDTO> inquiries = qnaService.getMyInquiries(email, page, size);
        return ResponseEntity.ok(inquiries);
    }

    // 모든 사용자의 문의 페이징 조회
    @GetMapping("/admin/all-inquiries")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<InquiryDTO>> getAllInquiries(
            @RequestParam(defaultValue = "0") int page, // 기본값: 0
            @RequestParam(defaultValue = "10") int size // 기본값: 10
    ) {
        Page<InquiryDTO> inquiries = qnaService.getAllInquiries(page, size);
        return ResponseEntity.ok(inquiries);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<InquiryDTO> getInquiryById(@PathVariable Long id, Authentication authentication) {
        InquiryDTO inquiry = qnaService.getInquiryById(id);

        // ROLE_USER일 경우 본인의 문의만 확인 가능
        if (authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_USER"))) {
            String email = authentication.getName();
            if (!inquiry.getPlayerEmail().equals(email)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }

        return ResponseEntity.ok(inquiry);
    }

    // 특정 문의 수정 (USER만 가능)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<String> updateInquiry(@PathVariable Long id, @RequestBody InquiryDTO inquiryDTO) {
        boolean isUpdated = qnaService.updateInquiry(id, inquiryDTO);
        if (isUpdated) {
            return ResponseEntity.ok("문의 수정 성공");
        }
        return ResponseEntity.status(400).body("문의 수정 실패");
    }

    // 특정 문의 삭제 (USER만 가능)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_USER')")
    public ResponseEntity<String> deleteInquiry(@PathVariable Long id) {
        boolean isDeleted = qnaService.deleteInquiry(id);
        if (isDeleted) {
            return ResponseEntity.ok("문의 삭제 성공");
        }
        return ResponseEntity.status(400).body("문의 삭제 실패");
    }
}
