package com.gamestore_back.service;

import com.gamestore_back.dto.InquiryDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface QnaService {

    // 특정 사용자의 문의 페이징 조회
    Page<InquiryDTO> getMyInquiries(String email, int page, int size);

    // 모든 사용자의 문의 페이징 조회
    Page<InquiryDTO> getAllInquiries(int page, int size);

    // 특정 문의 조회
    InquiryDTO getInquiryById(Long id);


    // 문의 수정
    boolean updateInquiry(Long id, InquiryDTO inquiryDTO);

    // 문의 삭제
    boolean deleteInquiry(Long id);
}
