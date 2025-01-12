import jwtAxios, { baseURL } from "../util/jwtUtil";

const refundEndpoint = `${baseURL}/admin/refunds`;

// 환불 요청 목록 조회
export const getRefundRequests = async () => {
  try {
    const response = await jwtAxios.get(refundEndpoint);
    return response.data; // 환불 요청 목록 반환
  } catch (error) {
    console.error("환불 요청 목록 조회 오류:", error);
    throw error;
  }
};

// 환불 요청 승인
export const approveRefund = async (refundId) => {
  try {
    await jwtAxios.post(`${refundEndpoint}/${refundId}/approve`);
  } catch (error) {
    console.error("환불 요청 승인 오류:", error);
    throw error;
  }
};

// 환불 요청 거절
export const rejectRefund = async (refundId) => {
  try {
    await jwtAxios.post(`${refundEndpoint}/${refundId}/reject`);
  } catch (error) {
    console.error("환불 요청 거절 오류:", error);
    throw error;
  }
};
