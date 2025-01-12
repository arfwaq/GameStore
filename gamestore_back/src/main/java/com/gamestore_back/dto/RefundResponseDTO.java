package com.gamestore_back.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundResponseDTO {

    private Long refundId;         // 환불 요청 ID
    private Long orderId;          // 주문 ID

    // ============ 게임 환불 정보 ============
    private Long appId;            // 게임 ID
    private String gameName;       // 게임 이름
    private String thumbnailUrl;   // 게임 썸네일 URL
    private BigDecimal price;      // 게임 가격

    // ============ 장비 환불 정보 (추가) ============
    private Long equipmentId;      // 장비 ID
    private String equipmentName;  // 장비 이름
    private String equipmentImageUrl; // 장비 썸네일
    private BigDecimal equipmentPrice; // 장비 가격 (선택)

    private String email;          // 요청자 이메일
    private String status;         // (PENDING, APPROVED, REJECTED)
    private LocalDateTime requestDate; // 요청 생성 날짜
}
