// src/components/GameEquipmentDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { decodeJWT } from "../../util/jwtUtil";
import Navbar from "../../components/Navbar";

// 장비 조회용 API
import GameEquipmentsApi from "../../api/GameEquipmentsApi";
// 주문/결제(구매) 관련 API
import { getOrdersByPlayer, createOrder } from "../../api/OrderApi";
import EqCartApi from "../../api/EqCartApi";

import "../../css/gameEquipmentDetail.css";
import { getCartItems as getGameCartItems } from "../../api/cartApi";

const GameEquipmentDetail = () => {
  const { id } = useParams(); // 장비 ID
  const navigate = useNavigate();
  const decodedEmail = decodeJWT();

  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  const [cartItemCount, setCartItemCount] = useState(0); // 카트 아이템 갯수

  // ★ 수량 state 추가
  const [quantity, setQuantity] = useState(1);

  // 장바구니 아이템 갯수를 가져오는 함수 추가
  const fetchCartItemCount = async () => {
    try {
      const [gameItems, eqItems] = await Promise.all([
        getGameCartItems(),
        EqCartApi.getCartItems(),
      ]);
      const totalItems = gameItems.length + eqItems.length;
      setCartItemCount(totalItems);
    } catch (error) {
      console.error("장바구니 아이템 갯수를 가져오는 중 오류:", error);
    }
  };

  // 장비 상세 정보 불러오기
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const data = await GameEquipmentsApi.getEquipmentById(id);
        setEquipment(data);
      } catch (error) {
        console.error("장비 정보 조회 실패:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEquipment();
  }, [id]);

  // 구매 상태 확인
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!decodedEmail) return;
      try {
        const allOrders = await getOrdersByPlayer();
        // allOrders: [{ orderId, email, appId, equipmentId, purchasePrice, quantity, ... }, ...]
        const purchased = allOrders.some(
            (order) => parseInt(order.equipmentId) === parseInt(id)
        );
        setIsPurchased(purchased);
      } catch (error) {
        console.error("구매 내역 조회 오류:", error.message);
      }
    };
    checkPurchaseStatus();
  }, [id, decodedEmail]);

  // 컴포넌트 마운트 시 장바구니 아이템 갯수 초기화
  useEffect(() => {
    fetchCartItemCount();
  }, []);

  // 장바구니에 추가
  const handleAddToCart = async () => {
    // 로그인 여부 확인
    if (!decodedEmail) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/player/login");
      return;
    }

    // 이미 구매한 장비인지 확인
    if (isPurchased) {
      setCartMessage("이미 구매한 장비는 장바구니에 추가할 수 없습니다.");
      return;
    }

    try {
      // 현재 장바구니 데이터 가져오기
      const currentCart = await EqCartApi.getCartItems();
      const duplicate = currentCart.some(
        (item) => parseInt(item.equipmentId) === parseInt(id)
      );

      if (duplicate) {
        setCartMessage("이미 장바구니에 있는 장비입니다.");
        return;
      }

      // 장바구니에 추가 요청
      await EqCartApi.postChangeCart({
        equipment_id: id,
        action: "add",
        quantity: quantity,
        ownerEmail: decodedEmail, // 소유자 이메일
      });

      setCartMessage("장바구니에 추가되었습니다!");
      await fetchCartItemCount(); // 장바구니 갯수 업데이트
    } catch (error) {
      console.error("장바구니 추가 실패:", error.message);
      setCartMessage("장바구니 추가 중 오류가 발생했습니다.");
    }
  };


  // "구매하기" 로직
  const handlePurchase = async () => {
    if (!decodedEmail) {
      alert("로그인이 필요합니다.");
      navigate("/player/login");
      return;
    }

    setPurchaseLoading(true);

    // 이미 구매했는지 재확인
    try {
      const allOrders = await getOrdersByPlayer();
      const alreadyPurchased = allOrders.some(
          (order) => parseInt(order.equipmentId) === parseInt(id)
      );
      if (alreadyPurchased) {
        alert("이미 구매한 장비입니다.");
        setIsPurchased(true);
        setPurchaseLoading(false);
        return;
      }
    } catch (error) {
      console.error("구매 여부 확인 오류:", error.message);
      alert("구매 여부를 확인할 수 없습니다.");
      setPurchaseLoading(false);
      return;
    }

    // 아임포트 결제
    try {
      const { IMP } = window;
      IMP.init("imp02701805");
      const paymentData = {
        pg: "kakaopay",
        pay_method: "card",
        merchant_uid: `order_${new Date().getTime()}`,
        name: equipment.name,
        // ★ 수량을 고려한 총액
        amount: equipment.price * quantity,
        buyer_email: decodedEmail,
        buyer_name: "홍길동",
        buyer_tel: "010-1234-5678",
      };

      IMP.request_pay(paymentData, async (response) => {
        if (response.success) {
          alert("결제가 완료되었습니다!");
          try {
            // 결제 성공 시 -> 주문 생성
            const orderData = {
              // 장비 주문
              equipmentId: parseInt(id),
              purchasePrice: equipment.price * quantity,
              quantity: quantity, // ★ 수량 전달
              impUid: response.imp_uid,
              merchantUid: response.merchant_uid,
            };
            const newOrder = await createOrder(orderData);

            if (newOrder.orderId) {
              alert("주문이 성공적으로 생성되었습니다. 마이페이지로 이동합니다.");
              setIsPurchased(true);
              navigate("/mypage");
            } else {
              alert("구매 정보 저장 중 오류가 발생했습니다.");
            }
          } catch (err) {
            console.error("주문 생성 실패:", err.message);
            alert("주문 생성 중 오류가 발생했습니다.");
          }
        } else {
          alert(`결제 실패: ${response.error_msg}`);
        }
        setPurchaseLoading(false);
      });
    } catch (error) {
      console.error("결제 처리 중 오류:", error.message);
      alert("결제 처리 중 오류가 발생했습니다.");
      setPurchaseLoading(false);
    }
  };

  // 장바구니 페이지로 이동
  const handleCartButtonClick = () => {
    navigate("/cart");
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }
  if (!equipment) {
    return <div className="error-message">장비 정보를 불러올 수 없습니다.</div>;
  }

  return (
      <>
        <Navbar />
        <div className="equipment-detail-container">
          <img
              src={equipment.imageUrl}
              alt={equipment.name}
              className="equipment-image"
          />
          <h1 className="equipment-name">{equipment.name}</h1>
          <p className="equipment-price">
            가격: {equipment.price ? `${equipment.price.toLocaleString()}원` : "가격 미정"}
          </p>
          <p className="equipment-description">{equipment.description}</p>

          {/* ★ 수량 선택 UI */}
          <div className="quantity-section" style={{margin: "10px 0"}}>
            <label htmlFor="quantity" style={{color: "black"}}>
              수량: </label>

            <input
                id="quantity"
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (isNaN(value) || value < 1) {
                    setQuantity(1);
                  } else {
                    setQuantity(value);
                  }
                }}
                style={{
                  width: "60px",
                  marginLeft: "5px",
                  textAlign: "center",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  height: "30px",
                }}
            />
          </div>

          {/* 장바구니 추가 섹션 */}
          <div className="cart-add-section">
            <button
                onClick={handleAddToCart}
                className={isPurchased ? "button-disabled" : "button-success"}
                disabled={isPurchased}
            >
              장바구니에 추가
            </button>
            {cartMessage && (
                <p
                    style={{
                      marginTop: "10px",
                      color: cartMessage.includes("추가") ? "green" : "red",
                      fontWeight: "bold",
                    }}
                >
                  {cartMessage}
                </p>
            )}
          </div>

          {/* 결제 버튼 */}
          <div className="payment-section">
            {isPurchased ? (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  이미 구매하신 장비입니다.
                </p>
            ) : (
                <button
                    onClick={handlePurchase}
                    className={purchaseLoading ? "button-disabled" : "button-primary"}
                    disabled={purchaseLoading}
                >
                  {purchaseLoading ? "구매 중..." : "구매하기"}
                </button>
            )}
          </div>

          <div className="additional-info" style={{ marginTop: "20px" }}>
            <p className="equi_detail">추가 정보</p>
            <p>{equipment.additionalInfo}</p>
          </div>
        </div>
        <button
            className="cart-button"
            onClick={handleCartButtonClick}
            title="장바구니"

        >
          🛒
          {cartItemCount > 0 && (
              <div
                  className="cart-item-count"

              >
                {cartItemCount}
              </div>
          )}
        </button>
      </>
  );
};

export default GameEquipmentDetail;
