package com.gamestore_back.controller;

import com.gamestore_back.dto.FaqDTO;
import com.gamestore_back.service.FaqService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

// 컨트롤러
@RestController
@RequestMapping("/api/faq")
public class FaqController {

    private final FaqService faqService;

    @Autowired
    public FaqController(FaqService faqService) {
        this.faqService = faqService;
    }
//전체 카테고리로 모든 FAQ 가져오기
    @GetMapping
    public Page<FaqDTO> getAllFaqs(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return faqService.getAllFaqs(pageable);
    }

//각 카테로기별 FAQ가져오기
@GetMapping("/category/{categoryId}")
public Page<FaqDTO> getFaqsByCategory(@PathVariable Long categoryId,
                                      @RequestParam(defaultValue = "0") int page,
                                      @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    return faqService.getFaqsByCategory(categoryId, pageable);
}


    // 특정 FAQ 조회
    @GetMapping("/{faqId}")
    public FaqDTO getFaqById(@PathVariable Long faqId) {
        return faqService.getFaqById(faqId);
    }

    //Faq생성
    @PostMapping
    public FaqDTO createFaq(@RequestBody FaqDTO faqDTO) {
//        System.out.println("받은  FAQ 데이터: "+faqDTO);
        return faqService.createFaq(faqDTO);
    }

    //Faq수정
    @PutMapping("/{faqId}")
    public FaqDTO updateFaq(@PathVariable Long faqId, @RequestBody FaqDTO faqDTO) {
        return faqService.updateFaq(faqId, faqDTO);
    }

    //faq삭제
    @DeleteMapping("/{faqId}")
    public void deleteFaq(@PathVariable Long faqId) {
        faqService.deleteFaq(faqId);
    }


}

