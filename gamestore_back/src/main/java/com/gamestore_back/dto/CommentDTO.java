package com.gamestore_back.dto;

public class CommentDTO {
    private String username;
    private String content;

    // 기본 생성자
    public CommentDTO() {}

    // 인자 생성자
    public CommentDTO(String username, String content) {
        this.username = username;
        this.content = content;
    }



    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
