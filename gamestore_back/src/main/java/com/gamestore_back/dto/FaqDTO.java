package com.gamestore_back.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class FaqDTO {
    private Long faqId;
    private String question;
    private String answer;
    private Long categoryId;

    //기본 생성자
    public FaqDTO() {}

    // Constructor
    public FaqDTO(Long faqId, String question, String answer, Long categoryId) {
        this.faqId = faqId;
        this.question = question;
        this.answer = answer;
        this.categoryId = categoryId;
    }

    // Getter and Setter
    public Long getFaqId() {
        return faqId;
    }

    public void setFaqId(Long faqId) {
        this.faqId = faqId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}