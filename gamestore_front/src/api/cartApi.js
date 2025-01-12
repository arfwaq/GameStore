// src/api/cartApi.js
import jwtAxios, { decodeJWT } from "../util/jwtUtil";
import { API_SERVER_HOST } from "./todoApi";

const host = `${API_SERVER_HOST}/api/cart`;

/**
 * 장바구니 항목을 추가, 수정 또는 삭제합니다. (기존 로직 그대로)
 * @param {Object} cartItem - 장바구니 항목 데이터 (app_id, cino 등)
 * @returns {Promise<Array>} - 업데이트된 장바구니 항목 목록
 */
export const postChangeCart = async (cartItem) => {
  try {
    const emailFromToken = decodeJWT();
    if (!emailFromToken) {
      throw new Error("JWT에서 이메일을 추출할 수 없습니다.");
    }

    const requestBody = {
      ...cartItem,
      email: emailFromToken,
    };

    const res = await jwtAxios.post(`${host}/change`, requestBody);
    return res.data;
  } catch (error) {
    console.error("장바구니 항목 변경 오류:", error);
    throw error;
  }
};



/**
 * 장바구니 항목을 조회합니다.
 * => 백엔드 CartController의 getCartItems()에서 ?email=xxx 로 처리
 */
export const getCartItems = async () => {
  try {
    const emailFromToken = decodeJWT();
    if (!emailFromToken) {
      throw new Error("JWT에서 이메일을 추출할 수 없습니다.");
    }
    const res = await jwtAxios.get(`${host}/items?email=${emailFromToken}`);
    return res.data;
  } catch (error) {
    console.error("장바구니 항목 조회 오류:", error);
    throw error;
  }
};

/**
 * [B 방식] 장바구니에서 특정 항목(게임)을 삭제합니다.
 * => 백엔드 CartController.changeCart() 안에서 (action="remove") 처리
 * => Body: { email, app_id, action: 'remove' }
 * => 백엔드에서 (email, app_id)를 키로 CartItem 찾아 삭제
 */
export const removeCartItem = async (appId) => {
  try {
    const emailFromToken = decodeJWT();
    if (!emailFromToken) {
      throw new Error("JWT에서 이메일을 추출할 수 없습니다.");
    }

    // B 방식: (email, app_id, action="remove")
    const requestBody = {
      email: emailFromToken,
      app_id: appId,
      action: "remove",
    };


    // POST /api/cart/change
    const res = await jwtAxios.post(`${host}/change`, requestBody);
    return res.data;
  } catch (error) {
    console.error("장바구니 항목 삭제 오류:", error);
    throw error;
  }
};


/**
 * 장바구니를 전체 초기화합니다. (기존 로직 그대로)
 * => 백엔드 clearCart()가 필요하다면 ?email=xxx 방식
 */
export const clearCart = async () => {
  try {
    const emailFromToken = decodeJWT();
    if (!emailFromToken) {
      throw new Error("JWT에서 이메일을 추출할 수 없습니다.");
    }
    const res = await jwtAxios.delete(`${host}/clear?email=${emailFromToken}`);
    return res.data;
  } catch (error) {
    console.error("장바구니 초기화 오류:", error);
    throw error;
  }
};
