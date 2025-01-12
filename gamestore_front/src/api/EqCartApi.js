import axios from "axios";
import jwtAxios, { decodeJWT } from "../util/jwtUtil";


const EqCartApi = {
    /**
     * 1) 장바구니 목록 조회
     *   GET /api/eqcart
     */
    getCartItems: async () => {
        try {
            const emailFromToken = decodeJWT();
            if (!emailFromToken) {
                throw new Error("로그인된 사용자의 이메일을 가져올 수 없습니다.");
            }

            // 백엔드: EqCartController의 getCartItems() 호출
            const response = await jwtAxios.get("http://localhost:8080/api/eqcart", {
                params: { ownerEmail: emailFromToken },
            });

            const eqCartItems = response.data;

            // Cart.js에서 기존에 쓰는 필드에 맞춰 변환(매핑)
            const cartItems = eqCartItems.map((item) => ({
                cino: item.ecino,
                appId: item.gamingEquipment.id,
                gameName: item.gamingEquipment.name,
                gameDescription: item.gamingEquipment.description,
                thumbnailUrl: item.gamingEquipment.imageUrl,
                price: item.gamingEquipment.price || 0,
                discountRate: 0, // 할인율이 없으면 0
                email: emailFromToken, // JWT에서 추출된 이메일
            }));

            return cartItems;
        } catch (error) {
            console.error("Failed to fetch cart items:", error);
            throw error;
        }
    },

    /**
     * 2) 장바구니 아이템 추가/삭제/수량 변경
     *   POST /api/eqcart/change
     */
    postChangeCart: async ({ equipment_id, action, quantity = 1 }) => {
        try {
            const emailFromToken = decodeJWT();
            if (!emailFromToken) {
                throw new Error("로그인된 사용자의 이메일을 가져올 수 없습니다.");
            }

            const requestBody = {
                equipment_id,
                action,
                quantity,
                // email: emailFromToken, // 제거
            };

            await jwtAxios.post("http://localhost:8080/api/eqcart/change", requestBody, {
                params: { ownerEmail: emailFromToken }, // ownerEmail을 쿼리 파라미터로 추가
            });
        } catch (error) {
            console.error("Failed to change cart item:", error);
            throw error;
        }
    },


    /**
     * 3) 특정 장비 아이템을 장바구니에서 삭제 (remove)
     */
    removeCartItem: async (equipmentId) => {
        try {
            await EqCartApi.postChangeCart({
                equipment_id: equipmentId,
                action: "remove",
            });

            return EqCartApi.getCartItems();
        } catch (error) {
            console.error("Failed to remove cart item:", error);
            throw error;
        }
    },

    /**
     * 4) 장바구니 전체 비우기
     */
    clearCart: async () => {
        try {
            const items = await EqCartApi.getCartItems();
            for (const item of items) {
                await EqCartApi.removeCartItem(item.appId);
            }
            return [];
        } catch (error) {
            console.error("Failed to clear cart:", error);
            throw error;
        }
    },
};

export default EqCartApi;
