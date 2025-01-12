package com.gamestore_back.repository;

import com.gamestore_back.domain.GamingEquipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GamingEquipmentRepository extends JpaRepository<GamingEquipment, Long> {

     // 카테고리로 데이터 찾기
     Page<GamingEquipment> findByCategory(String category, Pageable pageable);

     // 카테고리와 브랜드로 데이터 찾기
     Page<GamingEquipment> findByCategoryAndBrand(String category, String brand, Pageable pageable);

     // 필요한 경우, 추가 JPQL 쿼리를 정의
     @Query("SELECT g FROM GamingEquipment g WHERE g.brand = :brand AND g.category = :category")
     Page<GamingEquipment> customFindByCategoryAndBrand(String category, String brand, Pageable pageable);

     @Query("SELECT DISTINCT g.brand FROM GamingEquipment g WHERE g.brand IS NOT NULL")
     List<String> findAllBrands();
}
