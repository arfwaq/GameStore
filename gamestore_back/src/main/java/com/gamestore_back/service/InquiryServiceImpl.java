package com.gamestore_back.service;

import com.gamestore_back.domain.Inquiry;
import com.gamestore_back.domain.Player;
import com.gamestore_back.dto.InquiryDTO;
import com.gamestore_back.repository.InquiryRepository;
import com.gamestore_back.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InquiryServiceImpl implements InquiryService {

    private final InquiryRepository inquiryRepository;
    private final PlayerRepository playerRepository;

    @Override
    public InquiryDTO saveInquiry(InquiryDTO dto) {
        // 작성자를 Player 테이블에서 조회
        Player player = playerRepository.findByEmail(dto.getPlayerEmail())
                .orElseThrow(() -> new IllegalArgumentException("Player not found with email: " + dto.getPlayerEmail()));

        // Inquiry 엔티티 생성 및 저장
        Inquiry inquiry = new Inquiry(dto.getTitle(), dto.getContent(), player);
        Inquiry savedInquiry = inquiryRepository.save(inquiry);

        // 저장된 엔티티를 DTO로 변환
        return InquiryDTO.builder()
                .id(savedInquiry.getId())
                .title(savedInquiry.getTitle())
                .content(savedInquiry.getContent())
                .playerEmail(player.getEmail())
                .playerNickname(player.getNickname())
                .build();
    }
}
