import jwtAxios from '../util/jwtUtil';

export const API_SERVER_HOST = 'http://localhost:8080';
const prefix = '/api/todo'; // baseURL이 설정되어 있으므로 호스트 제거
const gamePrefix = `/categories/games`;

// 공통 API 호출 함수 수정
const fetchData = async (url, params = {}) => {
  try {
    const res = await jwtAxios.get(url, { params });
    return res.data;
  } catch (error) {
    console.error('API 호출 에러:', error);
    throw error;
  }
};

// 게임 관련 API 호출
export const getGameInfo = async (appId) => {
  return await fetchData(`${gamePrefix}/${appId}`);
};

export const getFilteredGames = async (filterParams) => {
  return await fetchData(gamePrefix, filterParams);
};

// Todo 관련 함수들도 jwtAxios 사용하도록 수정
export const getOne = async (tno) => {
  const res = await jwtAxios.get(`/api/todo/${tno}`);
  return res.data;
};

export const getList = async (pageParam) => {
  const { page, size } = pageParam;
  const res = await jwtAxios.get(`/api/todo/list`, {
    params: { page, size },
  });
  return res.data;
};

export const postAdd = async (todoObj) => {
  const res = await jwtAxios.post(`/api/todo`, todoObj);
  return res.data;
};

export const deleteOne = async (tno) => {
  const res = await jwtAxios.delete(`/api/todo/${tno}`);
  return res.data;
};

export const putOne = async (todo) => {
  const res = await jwtAxios.put(`/api/todo/${todo.tno}`, todo);
  return res.data;
};
