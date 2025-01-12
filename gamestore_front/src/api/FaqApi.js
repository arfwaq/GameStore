import jwtAxios from '../util/jwtUtil';

const BASE_URL = 'http://localhost:8080/api/faq';

const FaqApi = {
  // FAQ 전체 목록 조회
  getFaqList: async (page, size) => {
    const response = await jwtAxios.get(
      `${BASE_URL}?page=${page}&size=${size}`
    );
    return response.data;
  },

  // 카테고리별 FAQ 조회
  getFaqsByCategory: async (categoryId, page, size) => {
    const response = await jwtAxios.get(
      `${BASE_URL}/category/${categoryId}?page=${page}&size=${size}`
    );
    return response.data;
  },

  // 특정 FAQ 조회
  getFaqById: async (faqId) => {
    const response = await jwtAxios.get(`${BASE_URL}/${faqId}`);
    return response.data;
  },

  // FAQ 생성
  createFaq: async (faqData) => {
    const response = await jwtAxios.post(`${BASE_URL}`, faqData);
    return response.data;
  },

  // FAQ 수정
  updateFaq: async (faqId, faqData) => {
    const response = await jwtAxios.put(`${BASE_URL}/${faqId}`, faqData);
    return response.data;
  },

  // FAQ 삭제
  deleteFaq: async (faqId) => {
    const response = await jwtAxios.delete(`${BASE_URL}/${faqId}`);
    return response.data;
  },
};

export default FaqApi;
