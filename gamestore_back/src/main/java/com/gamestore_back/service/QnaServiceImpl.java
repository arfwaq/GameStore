package com.gamestore_back.service;

import com.gamestore_back.domain.Inquiry;
import com.gamestore_back.domain.Player;
import com.gamestore_back.dto.InquiryDTO;
import com.gamestore_back.repository.InquiryRepository;
import com.gamestore_back.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QnaServiceImpl implements QnaService {

    private final InquiryRepository inquiryRepository;

    @Override
    public Page<InquiryDTO> getMyInquiries(String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Pageable 생성
        return inquiryRepository.findByPlayer_Email(email, pageable)
                .map(this::entityToDTO); // Entity -> DTO 변환
    }

    @Override
    public Page<InquiryDTO> getAllInquiries(int page, int size) {
        Pageable pageable = PageRequest.of(page, size); // Pageable 생성
        return inquiryRepository.findAll(pageable)
                .map(this::entityToDTO); // Entity -> DTO 변환
    }


    @Override
    public InquiryDTO getInquiryById(Long id) {
        return inquiryRepository.findById(id)
                .map(this::entityToDTO)
                .orElse(null);
    }

    @Override
    public boolean updateInquiry(Long id, InquiryDTO inquiryDTO) {
        return inquiryRepository.findById(id).map(inquiry -> {
            inquiry.setTitle(inquiryDTO.getTitle());
            inquiry.setContent(inquiryDTO.getContent());
            inquiryRepository.save(inquiry);
            return true;
        }).orElse(false);
    }

    @Override
    public boolean deleteInquiry(Long id) {
        if (inquiryRepository.existsById(id)) {
            inquiryRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // 엔티티 → DTO 변환
    private InquiryDTO entityToDTO(Inquiry inquiry) {
        return InquiryDTO.builder()
                .id(inquiry.getId())
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .playerEmail(inquiry.getPlayer().getEmail())
                .playerNickname(inquiry.getPlayer().getNickname())
                .build();
    }
}
