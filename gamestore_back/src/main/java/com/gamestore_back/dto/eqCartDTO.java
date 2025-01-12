package com.gamestore_back.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class eqCartDTO {
    private Long equipment_id;
    private String action;   // "add", "remove", "update"
    private int quantity;    // 수량 (예: add 시 2개, update 시 5개)
}
