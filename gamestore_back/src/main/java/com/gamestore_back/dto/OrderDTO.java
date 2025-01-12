package com.gamestore_back.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {

    private Long orderId;
    private String email;

    // === [게임 관련 필드] ===
    private Long appId;        // Game PK
    private String gameName;
    private String thumbnailUrl;

    // === [장비 관련 필드] ===
    private Long equipmentId;  // GamingEquipment PK
    private String equipmentName;
    private String equipmentImageUrl; // 썸네일, 등

    private double purchasePrice;
    private LocalDateTime purchaseDate;
}
