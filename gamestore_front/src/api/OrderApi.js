// src/api/orderApi.js
import jwtAxios, { decodeJWT } from "../util/jwtUtil";
import { API_SERVER_HOST } from "./todoApi";

// 백엔드의 주문 API 기본 경로 설정
const host = `${API_SERVER_HOST}/api/orders`;

/**
 * 주문을 생성합니다.
 * @param {Object} orderData - 주문 데이터 (appId, gameName, purchasePrice 등)
 * @returns {Promise<Object>} - 생성된 주문 데이터
 */
export const createOrder = async (orderData) => {
    try {
        const emailFromToken = decodeJWT();
        if (!emailFromToken) {
            throw new Error("JWT에서 이메일을 추출할 수 없습니다.");
        }

        const requestBody = {
            ...orderData,
            email: emailFromToken,
        };

        const res = await jwtAxios.post(`${host}`, requestBody);
        return res.data;
    } catch (error) {
        console.error("주문 생성 오류:", error);
        throw error;
    }
};

/**
 * 특정 유저의 주문 내역을 조회합니다.
 * @returns {Promise<Array>} - 유저의 주문 내역 배열
 */
export const getOrdersByPlayer = async () => {
    try {
        const emailFromToken = decodeJWT();
        if (!emailFromToken) {
            throw new Error("JWT에서 이메일을 추출할 수 없습니다.");
        }

        const res = await jwtAxios.get(`${host}`, {
            params: { email: emailFromToken },
        });
        return res.data;
    } catch (error) {
        console.error("주문 내역 조회 오류:", error);
        throw error;
    }
};



/**
 * 특정 주문에 대해 환불 요청을 생성합니다.
 * @param {number} orderId - 환불 요청할 주문의 ID
 * @returns {Promise<void>}
 */
export const requestRefund = async (orderId) => {
    try {
        await jwtAxios.post(`${host}/${orderId}/refund`);
    } catch (error) {
        console.error("환불 요청 오류:", error);
        throw error;
    }
};
