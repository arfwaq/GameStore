import jwtAxios, { decodeJWT } from "../util/jwtUtil";
import { API_SERVER_HOST } from "./todoApi";

const host = `${API_SERVER_HOST}/api/love`;

/**
 * 찜 항목을 추가합니다.
 * @param {Object} loveItem - 찜 항목 데이터 (app_id 등)
 * @returns {Promise<Array>} - 업데이트된 찜 항목 목록
 */
export const addLove = async (loveItem) => {
    try {
        const emailFromToken = decodeJWT();
        if (!emailFromToken) {
            throw new Error("JWT에서 이메일을 추출할 수 없습니다.");
        }

        const requestBody = {
            ...loveItem,
            email: emailFromToken,
        };

        const res = await jwtAxios.post(`${host}/change`, requestBody);
        return res.data;
    } catch (error) {
        console.error("찜 항목 변경 오류:", error);
        throw error;
    }
};

/**
 * 찜 항목을 조회합니다.
 * @returns {Promise<Array>} - 사용자 이메일 기준 찜 항목 목록
 */
export const getloveItems = async () => {
    try {
        const emailFromToken = decodeJWT();
        if (!emailFromToken) {
            throw new Error("JWT에서 이메일을 추출할 수 없습니다.");
        }
        const res = await jwtAxios.get(`${host}/items?email=${emailFromToken}`);
        return res.data;
    } catch (error) {
        console.error("찜 항목 조회 오류:", error);
        throw error;
    }
};

/**
 * 특정 찜 항목을 삭제합니다.
 * @param {number} appId - 삭제할 게임 ID
 * @returns {Promise<Array>} - 업데이트된 찜 항목 목록
 */
export const removeloveItem = async (appId) => {
    try {
        const emailFromToken = decodeJWT();
        if (!emailFromToken) {
            throw new Error("JWT에서 이메일을 추출할 수 없습니다.");
        }

        const requestBody = {
            email: emailFromToken,
            app_id: appId,
            action: "remove",
        };

        const res = await jwtAxios.post(`${host}/change`, requestBody);
        return res.data;
    } catch (error) {
        console.error("찜 항목 삭제 오류:", error);
        throw error;
    }
};

/**
 * 특정 게임의 찜 상태를 확인합니다.
 * @param {number} appId - 확인할 게임 ID
 * @returns {Promise<boolean>} - 찜 여부 (true/false)
 */
export const checkLoveStatus = async (appId) => {
    try {
        const emailFromToken = decodeJWT();
        if (!emailFromToken) {
            throw new Error("JWT에서 이메일을 추출할 수 없습니다.");
        }

        const res = await jwtAxios.get(`${host}/check?email=${emailFromToken}&appId=${appId}`);
        return res.data; // 서버에서 true/false 반환
    } catch (error) {
        console.error("찜 상태 확인 오류:", error);
        throw error;
    }
};
