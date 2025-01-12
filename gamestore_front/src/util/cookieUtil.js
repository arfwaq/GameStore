import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 쿠키 설정
export const setCookie = (name, value, days) => {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + days); // 보관 기한 설정
  return cookies.set(name, value, { path: "/", expires: expires });
};

// 쿠키 가져오기
export const getCookie = (name) => {
  return cookies.get(name);
};

// 쿠키 삭제
export const removeCookie = (name, path = "/") => {
  cookies.remove(name, { path });
};

// 닉네임 추출
export const getNicknameFromCookie = (cookieName) => {
  const cookieValue = getCookie(cookieName);
  if (!cookieValue) {
    console.warn(`No cookie value found for: ${cookieName}`);
    return null;
  }
  try {
    const parsedCookie = JSON.parse(cookieValue);
    return parsedCookie.nickname || null;
  } catch (error) {
    console.error("Failed to parse cookie:", error);
    return null;
  }
};


// 사용 예시
const cookieName = "userInfo"; // 저장된 쿠키 이름
const nickname = getNicknameFromCookie(cookieName);
console.log("닉네임:", nickname);
