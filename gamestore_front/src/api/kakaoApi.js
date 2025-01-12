import axios from "axios";
import { API_SERVER_HOST } from "./todoApi";

const rest_api_key = `e1dde535e4230b9c4fb44c2674fff2a2`; // rest키값
const redirect_uri = `http://localhost:3000/player/kakao`;

const auth_code_path = `https://kauth.kakao.com/oauth/authorize`;

const access_token_url = `https://kauth.kakao.com/oauth/token`;

export const getKakaoLoginLink = () => {
  const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  return kakaoURL;
};

export const getAccessToken = async (authCode) => {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: rest_api_key,
    redirect_uri: redirect_uri,
    code: authCode,
  });

  const header = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    withCredentials: false, // 명시적으로 false로 설정
  };

  const res = await axios.post(access_token_url, params, header);

  return res.data.access_token;
};


export const getPlayerWithAccessToken = async (accessToken) => {
  const res = await axios.get(
      `${API_SERVER_HOST}/api/player/kakao?accessToken=${accessToken}`
  );

  return res.data;
};
