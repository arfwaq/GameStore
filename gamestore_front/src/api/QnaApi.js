import jwtAxios from '../util/jwtUtil';

const BASE_URL = 'http://localhost:8080/api/qna';

const qnaApi = {
  getMyInquiries: async (email, page = 0, size = 10) => {
    try {
      const response = await jwtAxios.get(`${BASE_URL}/my-inquiries`, {
        params: { email, page, size }, // email을 쿼리 파라미터로 전달
      });
      return response.data;
    } catch (error) {
      console.error('내 문의 목록 조회 실패:', error);
      throw error;
    }
  },

  getAllInquiries: async (page = 0, size = 10) => {
    try {
      const response = await jwtAxios.get(`${BASE_URL}/admin/all-inquiries`, {
        params: { page, size },
      });
      return response.data; // 모든 문의 목록 반환
    } catch (error) {
      console.error('문의 목록 조회 실패:', error);
      throw error;
    }
  },

  getInquiryById: async (inquiryId) => {
    try {
      const response = await jwtAxios.get(`${BASE_URL}/${inquiryId}`); // 경로 변수로 ID 전달
      return response.data;
    } catch (error) {
      console.error('문의 조회 실패:', error);
      throw error;
    }
  },

  // 특정 문의 수정
  updateInquiry: async (inquiryId, updatedData) => {
    try {
      const response = await jwtAxios.put(
        `${BASE_URL}/${inquiryId}`, // 경로 변수로 ID 전달
        updatedData // 수정할 데이터 전달
      );
      return response.data;
    } catch (error) {
      console.error('문의 수정 실패:', error);
      throw error;
    }
  },

  // 특정 문의 삭제
  deleteInquiry: async (inquiryId) => {
    try {
      const response = await jwtAxios.delete(`${BASE_URL}/${inquiryId}`); // 경로 변수로 ID 전달
      return response.data;
    } catch (error) {
      console.error('문의 삭제 실패:', error);
      throw error;
    }
  },
};

export default qnaApi;
