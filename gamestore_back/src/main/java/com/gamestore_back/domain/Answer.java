package com.gamestore_back.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "inquiry_answer")
public class Answer extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 답변 ID

    @Column(nullable = false) // Not Null 제약 조건 확인
    private String content;

    @ManyToOne
    @JoinColumn(name = "inquiry_id", nullable = false)
    @JsonIgnore
    private Inquiry inquiry; // 문의와의 연관 관계 (Many-to-One)

    // 답변을 등록할 때, Inquiry를 설정하는 메소드
    public Answer(Inquiry inquiry, String content) {
        this.inquiry = inquiry;
        this.content = content;
    }

    public void updateContent(String newContent) {
        this.content = newContent;
    }





}
