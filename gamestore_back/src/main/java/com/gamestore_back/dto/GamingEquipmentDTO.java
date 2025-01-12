package com.gamestore_back.dto;

import com.gamestore_back.domain.GamingEquipment;
import lombok.Data;


@Data
public class GamingEquipmentDTO {
    private Long id; // 엔티티 ID
    private String name;
    private String category;
    private Integer price;
    private String brand;
    private String imageUrl;
    private String productUrl;

    public static GamingEquipmentDTO fromEntity(GamingEquipment equipment) {
        GamingEquipmentDTO dto = new GamingEquipmentDTO();
        dto.setId(equipment.getId());
        dto.setName(equipment.getName());
        dto.setCategory(equipment.getCategory());
        dto.setPrice(equipment.getPrice());
        dto.setBrand(equipment.getBrand());
        dto.setImageUrl(equipment.getImageUrl());
        dto.setProductUrl(equipment.getProductUrl());
        return dto;
    }
}
