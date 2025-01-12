// src/api/GameEquipmentsApi.js
import axios from "axios";

/**
 * (예시) JWT에서 이메일을 추출하거나,
 *         localStorage / Redux / Context 등에서 유저 이메일을 얻는 헬퍼.
 * 실제 프로젝트에 맞춰 수정하세요.
 */
function getUserEmail() {
    return localStorage.getItem("USER_EMAIL") || "testuser@example.com";
}

const GameCartEquipmentsApi = {
    /**
     * 1) 특정 장비 정보 조회
     *   GET /api/equipment/{id}
     *   - 백엔드가 해당 경로로 장비 디테일을 반환한다고 가정
     */
    getEquipmentById: async (id) => {
        const response = await axios.get(`http://localhost:8080/api/equipment/${id}`);
        // 반환 형식 예:
        // {
        //   id: 123,
        //   name: "장비이름",
        //   price: 10000,
        //   description: "자세한 설명",
        //   imageUrl: "...",
        //   ...
        // }
        return response.data;
    },

    /**
     * 2) 사용자 구매 내역 조회
     *   GET /api/purchase?email=xxx
     *   - 백엔드 PurchaseController가
     *     /api/purchase?email=... 로 구매 이력을 반환한다고 가정
     */
    getPurchasesByUser: async () => {
        const email = getUserEmail();
        const response = await axios.get("http://localhost:8080/api/purchase", {
            params: { email },
        });
        // 응답 예:
        // [
        //   { purchaseId: 1, equipmentId: 123, price: 10000, ... },
        //   { purchaseId: 2, equipmentId: 456, price: 0, ... },
        // ]
        return response.data;
    },

    /**
     * 3) 장비 구매 (결제 처리 후, 백엔드에 구매 정보 저장)
     *   POST /api/purchase
     *   - 결제 완료 후, 백엔드에 orderData를 전송해 DB에 구매 기록 생성
     */
    purchaseEquipment: async (orderData) => {
        // orderData 예:
        // {
        //   imp_uid: "결제ID",
        //   merchant_uid: "주문번호",
        //   email: "user@example.com",
        //   equipmentId: 123,
        //   price: 10000,
        //   paymentMethod: "card",
        // }
        const response = await axios.post("http://localhost:8080/api/purchase", orderData);

        // 백엔드에서 { success: true/false, ... } 형식으로 응답한다고 가정
        return response.data;
    },
};

export default GameCartEquipmentsApi;
