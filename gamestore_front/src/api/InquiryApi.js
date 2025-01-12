import jwtAxios from '../util/jwtUtil';
import { getCookie } from '../util/cookieUtil'; // 쿠키에서 사용자 정보를 가져오는 유틸리티

// 백엔드 서버의 기본 URL 설정
export const API_SERVER_HOST = 'http://localhost:8080';
const BASE_URL = `${API_SERVER_HOST}/api/inquiries`;

const inquiryApi = {
  // 문의 등록
  createInquiry: async (title, content) => {
    try {
      // 쿠키에서 사용자 정보 확인
      const playerInfo = getCookie('player'); // 쿠키에 저장된 사용자 정보
      if (!playerInfo || !playerInfo.roleNames) {
        throw new Error('로그인 후 이용 가능합니다.');
      }

      console.log('playerInfo:', playerInfo);
      console.log('roleNames:', playerInfo?.roleNames);

      // 사용자 권한 확인
      const allowedRoles = ['USER'];
      const hasAccess = playerInfo.roleNames.some((role) =>
        allowedRoles.includes(role)
      );
      if (!hasAccess) {
        throw new Error('문의 등록 권한이 없습니다.');
      }

      // API 호출로 문의 등록
      const response = await jwtAxios.post(BASE_URL, {
        title,
        content,
        playerEmail: playerInfo.email,
        playerNickname: playerInfo.nickname,
      });

      return response.data; // 백엔드에서 반환된 데이터
    } catch (error) {
      console.error('문의 등록 실패:', error);
      throw error;
    }
  },
};

export default inquiryApi;
