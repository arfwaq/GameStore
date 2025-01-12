package com.gamestore_back.controller;

import com.gamestore_back.dto.GamingEquipmentDTO;
import com.gamestore_back.service.GamingEquipmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipments")
public class GamingEquipmentController {

    private final GamingEquipmentService service;

    public GamingEquipmentController(GamingEquipmentService service) {
        this.service = service;
    }

    // 1. 전체 데이터 조회
    @GetMapping
    public List<GamingEquipmentDTO> getAllEquipments(
            @RequestParam(defaultValue = "전체") String category,
            @RequestParam(defaultValue = "전체") String brand,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int pageSize) {
        return service.getEquipmentsByCategoryAndBrand(category,brand, page, pageSize);
    }

    // 2. 카테고리별 데이터 조회 + 페이징 및 브랜드 필터링
    @GetMapping("/category/{category}")
    public List<GamingEquipmentDTO> getEquipmentsByCategoryAndBrand(
            @PathVariable String category,
            @RequestParam(defaultValue = "전체") String brand,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int pageSize) {



        return service.getEquipmentsByCategoryAndBrand(category, brand, page, pageSize);
    }

    @GetMapping("/brands")
    public List<String> getAllBrands() {
        return service.getAllBrands();
    }

    // 3. 세부 정보 조회
    @GetMapping("/{id}")
    public GamingEquipmentDTO getEquipmentById(@PathVariable Long id) {
        return service.getEquipmentById(id);
    }
}
