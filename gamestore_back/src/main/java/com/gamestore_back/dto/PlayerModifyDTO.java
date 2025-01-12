package com.gamestore_back.dto;

import lombok.*;

// PlayerModifyDTO (추가된 DTO 클래스 예제)
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlayerModifyDTO {
    private String email;
    private String pw;
    private String nickname;
    private boolean social;
    private String currentPassword; // 현재 비밀번호 추가
}
