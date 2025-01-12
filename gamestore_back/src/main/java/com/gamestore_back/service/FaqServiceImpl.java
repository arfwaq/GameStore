package com.gamestore_back.service;

import com.gamestore_back.domain.Faq;
import com.gamestore_back.dto.FaqDTO;
import com.gamestore_back.repository.FaqRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


// ServiceImpl 구현체
@Service
public class FaqServiceImpl implements FaqService {

    private final FaqRepository faqRepository;
    private final ModelMapper modelMapper;

    @Autowired
    public FaqServiceImpl(FaqRepository faqRepository, ModelMapper modelMapper) {
        this.faqRepository = faqRepository;
        this.modelMapper = modelMapper;
    }

    @Override
    public Page<FaqDTO> getAllFaqs(Pageable pageable){

        //regDate를 기준으로 내림차순 정렬
        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(),
                pageable.getPageSize(), Sort.by("regDate").descending());

        //FAQ 엔티티를 페이징 조회
        Page<Faq> faqPage = faqRepository.findAll(sortedPageable);

        //FAQ 엔티티를 DTO로 변환
        return faqPage.map(faq -> new FaqDTO(
                faq.getFaqId(),
                faq.getQuestion(),
                faq.getAnswer(),
                faq.getCategoryId()
        ));
    }

    @Override
    public FaqDTO getFaqById(Long faqId){
        Faq faq = faqRepository.findById(faqId)
                .orElseThrow(()-> new RuntimeException("faq not found"));
        return toFaqDTO(faq);
    }


// 카테고리별 FAQ 조회
@Override
public Page<FaqDTO> getFaqsByCategory(Long categoryId, Pageable pageable) {

// regDate 기준 내림차순 정렬 추가
    Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Order.desc("regDate"))
    );

    // 카테고리별 FAQ 조회
    Page<Faq> faqPage = faqRepository.findByCategoryId(categoryId, sortedPageable);


    // Faq 엔티티를 FaqDTO로 변환하여 반환
    return faqPage.map(faq -> modelMapper.map(faq, FaqDTO.class));
}


    @Override
    public FaqDTO createFaq(FaqDTO faqDTO) {


        // Faq 객체를 categoryId로 직접 생성
        Faq faq = Faq.builder()
                .question(faqDTO.getQuestion())
                .answer(faqDTO.getAnswer())
                .categoryId(faqDTO.getCategoryId())  // categoryId만 설정
                .build();

        // faq 저장
        faq = faqRepository.save(faq);  // 저장된 faq를 다시 받아옵니다

        return toFaqDTO(faq);  // 저장된 Faq를 FaqDTO로 변환하여 반환
    }

    @Override
    public FaqDTO updateFaq(Long faqId, FaqDTO faqDTO) {
        // 기존 FAQ 조회
        Faq faq = faqRepository.findById(faqId)
                .orElseThrow(() -> new IllegalArgumentException("FAQ not found"));

        // 새로운 값으로 객체를 업데이트
        faq = Faq.builder()
                .faqId(faq.getFaqId())  // 기존 ID를 그대로 사용
                .question(faqDTO.getQuestion())  // 새로운 질문
                .answer(faqDTO.getAnswer())  // 새로운 답변
                .categoryId(faqDTO.getCategoryId())  // 새로운 카테고리 ID
                .build();  // 새 객체 생성

        // 수정된 FAQ 저장
        faqRepository.save(faq);

        // DTO로 변환하여 반환
        return toFaqDTO(faq);
    }

    @Override
    public void deleteFaq(Long faqId) {
        // FAQ 존재 여부 체크 후 삭제
        Faq faq = faqRepository.findById(faqId)
                .orElseThrow(() -> new IllegalArgumentException("FAQ not found"));

        // 삭제 처리
        faqRepository.delete(faq);
    }

    private FaqDTO toFaqDTO(Faq faq) {
        FaqDTO faqDTO = new FaqDTO();
        faqDTO.setFaqId(faq.getFaqId());
        faqDTO.setQuestion(faq.getQuestion());
        faqDTO.setAnswer(faq.getAnswer());
        faqDTO.setCategoryId(faq.getCategoryId());

        return faqDTO;
    }

}
