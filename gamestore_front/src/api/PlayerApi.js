import axios from "axios";
import { API_SERVER_HOST } from "./todoApi";

const host = `${API_SERVER_HOST}/api/player`; // Player API 경로

// 로그인 요청 함수
export const loginPost = async (loginParam) => {
  // HTTP POST 요청을 통해 FormData를 전송
  const header = { headers: { "Content-Type": "application/x-www-form-urlencoded" } };

  const form = new FormData();
  form.append("username", loginParam.email); // username에 이메일 추가
  form.append("password", loginParam.pw); // password에 비밀번호 추가

  const res = await axios.post(`${host}/login`, form, header);

  return res.data;
};

// Player 정보 수정 함수
export const modifyPlayer = async (playerData) => {
  const res = await axios.put(`${host}/modify`, playerData); // 경로와 함수명 수정
  return res.data;
};
export const modifyPassword = async (email, currentPassword, newPassword) => {
  try {
    const response = await axios.put(`${host}/modify-pw`, {
      email,
      currentPassword,
      newPassword,
    });
    return response.data; // 성공 메시지 반환
  } catch (error) {
    console.error("비밀번호 변경 요청 실패:", error);
    throw error; // 호출한 쪽에서 에러 처리
  }
};


