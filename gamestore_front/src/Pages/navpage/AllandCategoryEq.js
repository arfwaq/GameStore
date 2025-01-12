// src/pages/AllandCategoryEq.jsx

import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import AllEquipments from '../AllEquipments';
import styles from '../../css/AllandCategoryEq.module.css'; // 새로운 CSS 모듈

const categories = [
    '전체',
    '게이밍 마우스',
    '게이밍 키보드',
    '게이밍 모니터',
    '게이밍 헤드셋',
    '게이밍 스피커',
    '게이밍 장패드',
    '레이싱 휠',
    '조이스틱',
    '아케이드 스틱',
    '모션 컨트롤러',
    'VR 헤드셋',
    'VR 센서',
    'VR 글러브',
    '게이밍 의자',
    '스트리밍 장비',
    'RGB 조명',
    '게이밍 데스크',
    // 필요한 모든 카테고리를 추가
];

const AllandCategoryEq = () => {
    const [selectedCategory, setSelectedCategory] = useState('전체');

    const handleSelectChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return (
      <div>
          <Navbar />
          <div className={styles.equipmentPage}>
              {/* 카테고리 목록 - 데스크탑용 버튼 */}
              <div className={styles.categoriesContainer}>
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
                      onClick={() => setSelectedCategory(category)}
                      aria-pressed={selectedCategory === category} // 접근성 개선
                    >
                        {category}
                    </button>
                  ))}
              </div>
              전체 장비
              {/* 카테고리 목록 - 모바일용 드롭다운 */}
              <div className={styles.mobileCategoriesContainer}>
                  <select
                    value={selectedCategory}
                    onChange={handleSelectChange}
                    className={styles.categorySelect}
                    aria-label="카테고리 선택"
                  >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                      ))}
                  </select>
              </div>

              {/* 선택된 카테고리의 장비 목록 */}
              <section className={styles.allEquipmentsSection}>
                  <h2 className={styles.allandhtext}>{selectedCategory} 장비</h2>
                  {/* 핵심: limit={10}으로 고정해서, 한 번에 10개씩만 가져오도록 설정 */}
                  <AllEquipments category={selectedCategory} limit={10} />
              </section>
          </div>
      </div>
    );
};

export default AllandCategoryEq;
