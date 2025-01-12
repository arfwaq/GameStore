package com.gamestore_back.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class AnswerDTO {

    private Long id;          // 답변 ID
    private Long inquiryId;   // 문의 ID
    private String content;   // 답변 내용
    private String createdAt; // 생성일 (BaseEntity로부터)
    private String updatedAt; // 수정일 (BaseEntity로부터)

    // 생성자 (빌더 활용 가능)
    public AnswerDTO(Long id, Long inquiryId, String content, String createdAt, String updatedAt) {
        this.id = id;
        this.inquiryId = inquiryId;
        this.content = content;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}