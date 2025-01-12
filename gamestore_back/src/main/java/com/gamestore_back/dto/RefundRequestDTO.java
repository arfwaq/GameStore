package com.gamestore_back.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundRequestDTO {

    private Long orderId;      // 주문 ID
    private Long appId;        // 게임 ID (게임 환불용, optional)
    private Long equipmentId;  // 장비 ID (장비 환불용, optional)
    private String email;      // 요청자 이메일
}
