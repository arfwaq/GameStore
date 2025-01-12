import React, { useState, useEffect, useRef, useCallback } from "react";
import GameEquipmentsApi from "../api/GameEquipmentsApi";
import styles from "../css/categoryEquipments.module.css";

const CategoryEquipments = ({ category }) => {
  const [equipments, setEquipments] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("전체");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);

  const fetchEquipments = useCallback(async (currentPage) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data = await GameEquipmentsApi.getEquipmentsByCategory(
        currentPage,
        10,
        selectedBrand === "전체" ? null : selectedBrand,
        category
      );

      setEquipments((prev) =>
        currentPage === 1 ? data : [...prev, ...data] // 페이지 1이면 새로 덮어씀
      );      
      setHasMore(data.length > 0);

      if (currentPage === 1) {
        const allBrands = [...equipments, ...data].map((eq) => eq.brand || "기타");
        const uniqueBrands = Array.from(new Set(allBrands));
        setBrands(["전체", ...uniqueBrands]);
      }
    } catch (error) {
      console.error(`${category} 데이터 로드 실패:`, error);
    } finally {
      setLoading(false);
    }
  }, [selectedBrand, category, loading, hasMore]);

  const fetchBrands = useCallback(async () => {
    try {
      const response = await GameEquipmentsApi.getAllBrands();
      setBrands(["전체", ...response]); // "전체" 옵션 추가
    } catch (error) {
      console.error("브랜드 목록 로드 실패:", error);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  // 브랜드 변경 시 페이지를 1로 초기화하고 데이터 새로 로드
useEffect(() => {
  // 페이지를 1로 설정하기 전에 로드 로직 실행 방지
  setPage(1); // 페이지를 1로 초기화
  setEquipments([]); // 데이터를 초기화
  fetchEquipments(1); // 페이지 1에서 데이터 새로 로드
  setHasMore(true);
}, [selectedBrand]);

  
useEffect(() => {
  // 페이지 변경 로직이 브랜드 초기화와 충돌하지 않도록 처리
  
  if (page > 1) {
    fetchEquipments(page); // 현재 페이지에 맞는 데이터 로드
  }
  
}, [page, fetchEquipments]);

  

  // 가로 스크롤 이벤트 처리
  const handleWheel = (e) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += e.deltaY; // 마우스 휠을 가로 스크롤로 변환
      e.preventDefault(); // 기본 스크롤 동작 방지
    }
  };

  // 스크롤이 끝에 도달했는지 확인하고 데이터 로드
  const handleScroll = () => {
    if (
      containerRef.current &&
      containerRef.current.scrollLeft + containerRef.current.clientWidth >=
        containerRef.current.scrollWidth - 10 &&
      hasMore &&
      !loading
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel);
      container.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.filter}>
        <label htmlFor="brand-filter">브랜드 선택:</label>
        <select
          id="brand-filter"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          {brands.map((brand, index) => (
            <option key={brand || `brand-${index}`} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.list}>
        {equipments.map((equipment, index) => (
          <div key={`${equipment.id || "no-id"}-${index}`} className={styles.item}>
            <img src={equipment.imageUrl} alt={equipment.name} />
            <h3>{equipment.name}</h3>
            <p>{equipment.price ? `${equipment.price}원` : "가격 미정"}</p>
          </div>
        ))}
      </div>
      {loading && <p>로딩 중...</p>}
      {!hasMore && <p>더 이상 데이터가 없습니다.</p>}
    </div>
  );
};

export default CategoryEquipments;
