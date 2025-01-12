package com.gamestore_back.service;

import com.gamestore_back.domain.GamingEquipment;
import com.gamestore_back.dto.GamingEquipmentDTO;
import com.gamestore_back.repository.GamingEquipmentRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GamingEquipmentServiceImpl implements GamingEquipmentService {

    private final GamingEquipmentRepository repository;

    public GamingEquipmentServiceImpl(GamingEquipmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public void saveEquipment(GamingEquipment equipment) {
        repository.save(equipment);
    }

    @Override
    public List<GamingEquipmentDTO> getAllEquipments() {
        return repository.findAll().stream()
                .map(GamingEquipmentDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<GamingEquipmentDTO> getEquipmentsByCategoryAndBrand(String category, String brand, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize); // Page는 0부터 시작

        // 카테고리와 브랜드에 따라 분기 처리
        if ("전체".equals(category) && "전체".equals(brand)) {
            // 카테고리와 브랜드가 모두 '전체'인 경우
            return repository.findAll(pageable).stream()
                    .map(GamingEquipmentDTO::fromEntity)
                    .collect(Collectors.toList());
        } else if ("전체".equals(category)) {
            // 카테고리는 무시, 브랜드로 필터링
            return repository.findByCategoryAndBrand(null, brand, pageable).stream()
                    .map(GamingEquipmentDTO::fromEntity)
                    .collect(Collectors.toList());
        } else if ("전체".equals(brand)) {
            // 브랜드는 무시, 카테고리로 필터링
            return repository.findByCategory(category, pageable).stream()
                    .map(GamingEquipmentDTO::fromEntity)
                    .collect(Collectors.toList());
        } else {
            // 카테고리와 브랜드 모두 필터링
            return repository.findByCategoryAndBrand(category, brand, pageable).stream()
                    .map(GamingEquipmentDTO::fromEntity)
                    .collect(Collectors.toList());
        }
    }

    @Override
    public List<String> getAllBrands() {
        return repository.findAllBrands();
    }

    @Override
    public GamingEquipmentDTO getEquipmentById(Long id) {
        return repository.findById(id)
                .map(GamingEquipmentDTO::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException("해당 장비를 찾을 수 없습니다: " + id));
    }
}
