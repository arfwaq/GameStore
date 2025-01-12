package com.gamestore_back.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class InquiryDTO {
    private Long id; // 문의 ID
    private String title;
    private String content;
    private String playerEmail;    // 작성자 이메일
    private String playerNickname; // 작성자 닉네임

    // 생성자 추가 (빌더 활용)
    public InquiryDTO(Long id, String title, String content, String playerEmail, String playerNickname) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.playerEmail = playerEmail;
        this.playerNickname = playerNickname;
    }
}
