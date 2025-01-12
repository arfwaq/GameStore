// src/components/GameDetail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getGameInfo } from "../api/todoApi";
import { postChangeCart, getCartItems } from "../api/cartApi";
import { createOrder, getOrdersByPlayer } from "../api/OrderApi";
import "../css/gamedetail.css";
import ReviewBox from "../components/ReviewBox";
import { decodeJWT } from "../util/jwtUtil";
import Navbar from '../components/Navbar';

import { getCartItems as getGameCartItems } from "../api/cartApi"; // 장바구니 API 가져오기
import EqCartApi from "../api/EqCartApi"; // 장비 카트 API

// HTML 태그 제거 함수
const stripHtmlTags = (html) => {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};

const GameDetail = () => {
  const { appId } = useParams(); // URL에서 게임 ID 가져오기 (문자열)
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartMessage, setCartMessage] = useState("");
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const decodedEmail = decodeJWT(); // JWT에서 이메일 추출
  const [cartItemCount, setCartItemCount] = useState(0); // 카트 아이템 갯수

  const navigate = useNavigate();

  // Refactored fetchCartItemCount 함수
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

  // 게임 데이터 가져오기
  useEffect(() => {
    const fetchGameData = async () => {
      try {
        const data = await getGameInfo(appId);
        setGameData(data);
      } catch (error) {
        console.error("게임 정보를 가져오는 데 실패했습니다:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameData();
  }, [appId]);

  // 구매 상태 확인 (페이지 로드 시 1회)
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (decodedEmail) {
        try {
          const orders = await getOrdersByPlayer();
          const purchased = orders.some(
              (order) => parseInt(order.appId) === parseInt(appId)
          );
          setIsPurchased(purchased);
          console.log(`User has purchased game ${appId}: ${purchased}`);
        } catch (error) {
          console.error("구매 내역을 확인하는데 실패했습니다:", error.message);
        }
      }
    };

    checkPurchaseStatus();
  }, [appId, decodedEmail]);

  // 장바구니에 추가하는 함수
  const handleAddToCart = async () => {
    // 로그인 여부 확인
    if (!decodedEmail) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/player/login";
      return;
    }

    // 이미 구매한 게임인지 확인
    if (isPurchased) {
      setCartMessage("이미 구매한 게임은 장바구니에 추가할 수 없습니다.");
      return;
    }

    try {
      // 장바구니 데이터를 가져옴
      const currentCart = await getCartItems();
      const isDuplicate = currentCart.some(item => parseInt(item.appId) === parseInt(appId));

      if (isDuplicate) {
        setCartMessage("이미 장바구니에 있는 게임입니다.");
        return; // 중복된 경우 추가하지 않음
      }

      await postChangeCart({
        app_id: appId, // 서버가 요구하는 필드명에 맞게 사용
        action: "add",
      });
      setCartMessage("장바구니에 성공적으로 추가되었습니다!");

      // 실시간으로 장바구니 아이템 수 업데이트
      await fetchCartItemCount();
    } catch (error) {
      console.error("장바구니 추가 실패:", error.message);
      setCartMessage("장바구니 추가 중 오류가 발생했습니다.");
    }
  };


  // 장바구니 아이템 갯수 초기화
  useEffect(() => {
    fetchCartItemCount();
  }, []);

  const handleCartButtonClick = () => {
    navigate("/cart"); // 장바구니 페이지로 이동
  };

  // 결제 버튼 클릭 핸들러
  const handlePaymentClick = async () => {
    // 1) 로그인 여부 먼저 확인
    if (!decodedEmail) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      window.location.href = "/player/login";
      return;
    }

    try {
      // 2) 결제창을 띄우기 전에 중복 구매 여부 확인
      const orders = await getOrdersByPlayer();
      const alreadyPurchased = orders.some(
          (order) => parseInt(order.appId) === parseInt(appId)
      );
      if (alreadyPurchased) {
        alert("이미 이 게임을 구매하셨습니다. 중복 구매는 불가능합니다.");
        setIsPurchased(true);
        setPurchaseLoading(false);
        return; // 이미 구매했으면 결제창 띄우지 않고 종료
      }
    } catch (error) {
      console.error("구매 여부 확인 중 오류가 발생했습니다:", error.message);
      alert("구매 여부를 확인할 수 없습니다. 다시 시도해주세요.");
      setPurchaseLoading(false);
      return;
    }

    if (gameData.price === 0) {
      // 금액이 0원일 때, 결제 없이 구매 처리
      try {
        const orderData = {
          email: decodedEmail,
          appId: appId,
          gameName: gameData.gameName,
          purchasePrice: 0,
          paymentMethod: "free", // 무료 결제 방식 표시
        };

        await createOrder(orderData);
        alert("무료 구매가 완료되었습니다!");
        setIsPurchased(true);
        window.location.href = "/mypage"; // 마이페이지로 리다이렉트
      } catch (error) {
        console.error("무료 구매 처리 중 오류:", error.message);
        alert("무료 구매 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      return;
    }

    // 3) 아직 미구매 상태라면 결제 진행
    const { IMP } = window;
    IMP.init("imp02701805"); // 포트원 고객사 식별코드

    const paymentData = {
      pg: "kakaopay",
      pay_method: "card",
      merchant_uid: `order_${new Date().getTime()}`,
      name: gameData.gameName,
      amount: gameData.price,
      buyer_email: decodedEmail,
      buyer_name: decodedEmail,
      buyer_tel: "010-1234-5678",
    };

    console.log("Payment Data:", paymentData);

    IMP.request_pay(paymentData, async (response) => {
      if (response.success) {
        alert("결제가 완료되었습니다!");
        console.log("결제 성공 데이터:", response);

        // 결제 성공 시 백엔드에 주문 정보 전송
        try {
          const orderData = {
            email: decodedEmail,
            appId: appId,
            gameName: gameData.gameName,
            purchasePrice: gameData.price,
            paymentMethod: paymentData.pay_method,
          };

          console.log("Order Data to be created:", orderData);

          await createOrder(orderData);
          alert("주문이 성공적으로 생성되었습니다. 마이페이지로 이동합니다.");
          setIsPurchased(true);

          // 주문 후 마이페이지로 리다이렉트
          window.location.href = "/mypage";
        } catch (error) {
          console.error("주문 생성 실패:", error.message);
          alert("주문 생성 중 오류가 발생했습니다.");
        }
      } else {
        alert(`결제 실패: ${response.error_msg}`);
      }
      setPurchaseLoading(false);
    });
  };

  // 로딩 중 표시
  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
      <>
        <Navbar />
        <div className="game-detail-container">
          {gameData ? (
              <>
                {/* 게임 제목 */}
                <h1
                    className="game-title"
                    style={{
                      fontSize: "2.5rem",
                      fontWeight: "bold",
                      marginBottom: "20px",
                      color: "#fff",
                    }}
                >
                  {gameData.gameName}
                </h1>

                {/* 상단: 트레일러와 게임 정보 */}
                <div
                    className="game-header"
                    style={{
                      display: "flex",
                      gap: "20px",
                      alignItems: "flex-start",
                    }}
                >
                  {/* 왼쪽: 트레일러 또는 썸네일 */}
                  <div
                      className="media-container"
                      style={{
                        flex: "1",
                        maxWidth: "60%",
                        height: "315px",
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                  >
                    {gameData.trailerUrl ? (
                        <iframe
                            src={`${gameData.trailerUrl}?autoplay=1`}
                            title="Game Trailer"
                            allow="autoplay; fullscreen"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              border: "none",
                            }}
                        ></iframe>
                    ) : (
                        <img
                            src={gameData.thumbnailUrl}
                            alt={`${gameData.gameName} 썸네일`}
                            className="thumbnail"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                        />
                    )}
                  </div>

                  {/* 오른쪽: 게임 정보 */}
                  <div
                      className="game-info-container"
                      style={{
                        flex: "1",
                        padding: "20px",
                        backgroundColor: "#2a475e",
                        color: "#fff",
                        borderRadius: "8px",
                      }}
                  >
                    <h2 style={{ marginBottom: "10px", fontSize: "1.5rem" }}>
                      게임 정보
                    </h2>
                    <p>가격: {gameData.price.toLocaleString()}원</p>
                    {gameData.discountRate > 0 && (
                        <p>할인율: {gameData.discountRate}%</p>
                    )}
                    <p>출시일: {gameData.releaseDate}</p>
                    <p>장르: {gameData.genre}</p>
                    <p>나이 제한: {gameData.ageRestriction}</p>
                    <p>추천 수: {gameData.recommendations}</p>
                    <p>지원 언어: {stripHtmlTags(gameData.supportedLanguages)}</p>
                  </div>
                </div>

                {/* 장바구니 추가 섹션 */}
                <div className="cart-add-section" style={{ marginTop: "20px" }}>
                  <button
                      onClick={handleAddToCart}
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                  >
                    장바구니에 추가
                  </button>
                  {cartMessage && (
                      <p
                          style={{
                            marginTop: "10px",
                            color: cartMessage.includes("성공") ? "green" : "red",
                          }}
                      >
                        {cartMessage}
                      </p>
                  )}
                </div>

                {/* 결제 버튼 추가 */}
                <div className="payment-section" style={{ marginTop: "20px" }}>
                  {isPurchased ? (
                      <p style={{ color: "green", fontWeight: "bold" }}>
                        이미 구매하신 게임입니다.
                      </p>
                  ) : (
                      <button
                          onClick={handlePaymentClick}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "#007BFF",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                          disabled={purchaseLoading}
                      >
                        {purchaseLoading ? "구매 중..." : "구매하기"}
                      </button>
                  )}
                </div>

                {/* 중단: 게임 설명 */}
                <div className="game-description">
                  <h2>게임 설명</h2>
                  <p>{gameData.gameDescription}</p>
                </div>

                {/* 리뷰 컴포넌트 */}
                <ReviewBox appId={appId} />

                {/* 시스템 요구사항 */}
                <div className="game-specs">
                  <h2>시스템 요구사항</h2>
                  <div>
                    <h3>최소 사양</h3>
                    <p>{stripHtmlTags(gameData.minimumPcRequirements)}</p>
                  </div>
                  <div>
                    <h3>권장 사양</h3>
                    <p>{stripHtmlTags(gameData.recommendedPcRequirements)}</p>
                  </div>
                </div>
              </>
          ) : (
              <div className="error-message">게임 정보를 찾을 수 없습니다.</div>
          )}
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

export default GameDetail;
