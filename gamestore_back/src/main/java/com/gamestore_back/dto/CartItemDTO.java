package com.gamestore_back.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;


@Data
public class CartItemDTO {

    private String email; // 사용자 이메일
    private Long app_id;  // 게임 ID
    private Long cino;    // 장바구니 항목 ID
    private String action;  // "remove" 등 동작 타입
}
