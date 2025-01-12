package com.gamestore_back.service;

import com.gamestore_back.domain.GamingEquipment;
import com.gamestore_back.dto.GamingEquipmentDTO;

import java.util.List;

public interface GamingEquipmentService {

    //테스트 코드에서 데이터베이스에 저장할 때 쓰는 코드
    void saveEquipment(GamingEquipment equipment);


    List<GamingEquipmentDTO> getAllEquipments();
    List<GamingEquipmentDTO> getEquipmentsByCategoryAndBrand(String category, String brand,int page, int pageSize);
    GamingEquipmentDTO getEquipmentById(Long id);

    // 새로운 메서드
    List<String> getAllBrands();
}
