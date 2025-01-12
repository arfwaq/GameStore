import axios from "axios";
import jwtAxios from "../util/jwtUtil";

//서버 주소
export const API_SERVER_HOST = 'http://localhost:8080';
export const prefix = `${API_SERVER_HOST}/api/community`;

//게시글 등록
export const postAdd = async(communityObj)=>{
  const header={  headers: { "Content-Type": "multipart/form-data" }}
  try {
    const res = await axios.post(`${prefix}/add`, communityObj, header)
    return res.data;
  } catch (error) {
    console.error("API 호출 오류: ", error);
    throw error;
  }
};


//게시글 리스트
export const getList = async ( pageParam ) => {
  const {page,size} = pageParam;
  const res = await axios.get(`${prefix}/list`, {
    params: {page:page,size:size },
  });
    return res.data;
  };

//게시글 조회
export const getOne = async (comId) => {
    const res = await axios.get(`${prefix}/${comId}`);
    return res.data;
};

//게시글 수정
export const putOne = async (comId, community) => {
  const header = {
    headers: { "Content-Type": "multipart/form-data" },
  };

  // API 호출
    const res = await axios.put(`${prefix}/${comId}`,community, header);
    return res.data;
};

//게시글 삭제
export const deleteOne = async (comId) => {

  const res = await axios.delete(`${prefix}/${comId}` );

  return res.data;

};

//게시글당 댓글 수
export const replyCount = async(comId)=>{
  try {
    const res = await axios.get(`${prefix}/replyCount/${comId}`);
    return res.data;
  } catch(error){
    return "?";
  }
}

//댓글 리스트
export const replyList=async(comId, pageNum=1)=>{
  try {
    const res = await axios.get(`${prefix}/replyList/${comId}?page=${pageNum}`);
    return res.data;
  }catch (error){
    return "오류 발생";
  }
}

//댓글 등록
export const postAddReply = async(replyObj)=>{
  const header={  headers: { "Content-Type": "application/json" }}
  try {
    const res = await axios.post(`${prefix}/reply/add`, replyObj, header)
    return res.data;
  } catch (error) {
    console.error("API 호출 오류: ", error);
    throw error;
  }
};

//댓글 조회
export const getReply = async (comRno) => {
  const res = await axios.get(`${prefix}/reply/${comRno}`);
  return res.data;
};

//댓글 수정
export const putReply=async(comRno, modReply)=>{
  const header={  headers: { "Content-Type": "application/json" }}
  try {
    const res = await axios.put(`${prefix}/reply/modify/${comRno}`, modReply, header)
    return res.data;
  } catch (error) {
    console.error("API 호출 오류: ", error);
    throw error;
  }
}

//댓글 삭제
export const deleteReply=async(comRno)=>{
  const res = await axios.delete(`${prefix}/reply/delete/${comRno}` );
  return res.data;
}

