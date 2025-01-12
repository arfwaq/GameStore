package com.gamestore_back.dto;

import lombok.Data;

@Data
public class LoveItemDTO {

    private String email; // 사용자 이메일
    private Long app_id;  // 게임 ID
    private Long lino;    // 장바구니 항목 ID
    private String action;  // "remove" 등 동작 타입
}
