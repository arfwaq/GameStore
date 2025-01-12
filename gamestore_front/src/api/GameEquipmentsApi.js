import axios from 'axios'; // 일반 axios 사용

const BASE_URL = 'http://localhost:8080/api/equipments';

const GameEquipmentsApi = {
  // 모든 장비 목록 조회 (인증 없이)
  getAllEquipments: async (page = 1, pageSize = 20, brand = '전체', category = '전체') => {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: { page, pageSize, brand, category },
      });
      return response.data;
    } catch (error) {
      console.error('모든 장비 목록 조회 실패:', error);
      throw error;
    }
  },

  // 카테고리별 데이터 조회 (인증 없이)
  getEquipmentsByCategory: async (page = 1, pageSize = 10, brand = '전체', category) => {
    try {
      const response = await axios.get(`${BASE_URL}/category/${encodeURIComponent(category)}`, {
        params: { page, pageSize, brand },
      });
      return response.data;
    } catch (error) {
      console.error('카테고리별 데이터 조회 실패:', error);
      throw error;
    }
  },

  // 특정 장비 상세 조회 (JWT 인증 필요)
  getEquipmentById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('해당 장비 조회 실패:', error);
      throw error;
    }
  },



  // 모든 브랜드 목록 조회 (새로 추가)
  getAllBrands: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/brands`);
      return response.data; // 서버에서 브랜드 목록을 배열로 반환한다고 가정
    } catch (error) {
      console.error('모든 브랜드 목록 조회 실패:', error);
      throw error;
    }
  },
};

export default GameEquipmentsApi;
