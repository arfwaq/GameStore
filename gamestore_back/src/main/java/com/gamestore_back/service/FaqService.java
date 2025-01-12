package com.gamestore_back.service;


import com.gamestore_back.dto.FaqDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface FaqService {

    Page<FaqDTO> getAllFaqs(Pageable pageable);
    FaqDTO getFaqById(Long faqId);
    Page<FaqDTO> getFaqsByCategory(Long categoryId, Pageable pageable);
    FaqDTO createFaq(FaqDTO faqDTO);
    FaqDTO updateFaq(Long faqId, FaqDTO faqDTO);
    void deleteFaq(Long faqId);



}
