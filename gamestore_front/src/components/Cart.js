import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
    getCartItems as getGameCartItems,
    removeCartItem as removeGameItem,
    clearCart as clearGameCart
} from "../api/cartApi";   // 게임 카트 API
import EqCartApi from "../api/EqCartApi";         // 장비 카트 API
import { createOrder, getOrdersByPlayer } from "../api/OrderApi";
import { decodeJWT } from "../util/jwtUtil";
import "../css/cart.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const decodedEmail = decodeJWT(); // JWT에서 이메일 추출

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const [gameItems, eqItems] = await Promise.all([
                    getGameCartItems(),
                    EqCartApi.getCartItems()
                ]);

                const processedGameItems = gameItems.map(item => ({
                    ...item,
                    type: "game"
                }));

                const processedEqItems = eqItems.map(item => ({
                    ...item,
                    type: "equipment"
                }));

                const combined = [...processedGameItems, ...processedEqItems];
                setCartItems(combined);

                const sum = combined.reduce((acc, cur) => acc + (cur.price || 0), 0);
                setTotalPrice(sum);

                setIsLoggedIn(true);
            } catch (error) {
                console.error("장바구니 데이터를 가져오는 중 오류:", error);
                if (error.response && error.response.status === 401) {
                    setIsLoggedIn(false);
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchCartItems();
    }, []);

    const handleRemove = async (appId, itemType) => {
        try {
            if (itemType === "equipment") {
                await EqCartApi.removeCartItem(appId);
            } else if (itemType === "game") {
                await removeGameItem(appId);
            } else {
                console.error(`Unknown item type: ${itemType} for appId: ${appId}`);
                return;
            }

            const [gameItems, eqItems] = await Promise.all([
                getGameCartItems(),
                EqCartApi.getCartItems()
            ]);

            const processedGameItems = gameItems.map(item => ({
                ...item,
                type: "game"
            }));

            const processedEqItems = eqItems.map(item => ({
                ...item,
                type: "equipment"
            }));

            const combined = [...processedGameItems, ...processedEqItems];
            setCartItems(combined);
            setTotalPrice(combined.reduce((a, c) => a + (c.price || 0), 0));
        } catch (error) {
            console.error("아이템 삭제 오류:", error);
        }
    };

    const handlePurchaseAll = async () => {
        if (cartItems.length === 0) {
            alert("장바구니가 비어 있습니다.");
            return;
        }

        const freeGames = cartItems.filter(item => item.type === "game" && item.price === 0);
        const paidGames = cartItems.filter(item => item.type === "game" && item.price > 0);
        const freeEquipment = cartItems.filter(item => item.type === "equipment" && item.price === 0);
        const paidEquipment = cartItems.filter(item => item.type === "equipment" && item.price > 0);

        try {
            const processFreeItems = async (items, type) => {
                await Promise.all(
                    items.map(async (item) => {
                        const orderData = {
                            email: decodedEmail,
                            purchasePrice: 0,
                            paymentMethod: "free",
                            type,
                            ...(type === "game" ? { appId: item.appId } : { equipmentId: item.appId })
                        };
                        console.log(`Sending free ${type} order data:`, orderData);
                        await createOrder(orderData);
                    })
                );
                alert(`${items.length}개의 무료 ${type === "game" ? "게임" : "장비"}가 구매되었습니다!`);
            };

            if (freeGames.length > 0) await processFreeItems(freeGames, "game");
            if (freeEquipment.length > 0) await processFreeItems(freeEquipment, "equipment");

            if (paidGames.length === 0 && paidEquipment.length === 0) {
                await clearGameCart();
                await EqCartApi.clearCart();
                setCartItems([]);
                setTotalPrice(0);
                return;
            }

            const { IMP } = window;
            IMP.init("imp02701805");

            const totalAmount = [...paidGames, ...paidEquipment].reduce((sum, item) => sum + (item.price || 0), 0);
            const paymentData = {
                pg: "kakaopay",
                pay_method: "card",
                merchant_uid: `order_${new Date().getTime()}`,
                name: "장바구니 전체 구매",
                amount: totalAmount,
                buyer_email: decodedEmail,
                buyer_name: "홍길동",
                buyer_tel: "010-1234-5678",
            };

            console.log("결제 요청 데이터:", paymentData);

            IMP.request_pay(paymentData, async (response) => {
                if (response.success) {
                    alert("결제가 완료되었습니다!");
                    console.log("결제 성공 데이터:", response);

                    const processPaidItems = async (items, type) => {
                        await Promise.all(
                            items.map(async (item) => {
                                const orderData = {
                                    email: decodedEmail,
                                    purchasePrice: item.price,
                                    paymentMethod: paymentData.pay_method,
                                    type,
                                    ...(type === "game" ? { appId: item.appId } : { equipmentId: item.appId })
                                };
                                console.log(`Sending paid ${type} order data:`, orderData);
                                await createOrder(orderData);
                            })
                        );
                    };

                    if (paidGames.length > 0) await processPaidItems(paidGames, "game");
                    if (paidEquipment.length > 0) await processPaidItems(paidEquipment, "equipment");

                    await clearGameCart();
                    await EqCartApi.clearCart();
                    setCartItems([]);
                    setTotalPrice(0);
                    alert("모든 주문이 성공적으로 생성되었습니다!");
                } else {
                    alert(`결제 실패: ${response.error_msg}`);
                }
            });
        } catch (error) {
            console.error("구매 중 오류:", error);
            alert("구매 중 오류가 발생했습니다. 다시 시도해주세요.");
        }
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="cart-container">
                    <div className="cart-header">
                        <h1>Your Shopping Cart</h1>
                    </div>
                    <div className="cart-content">
                        <p>로딩 중...</p>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Your Shopping Cart</h1>
                </div>
                <div className="cart-content">
                    {!isLoggedIn ? (
                        <div className="empty-cart">
                            <p>로그인 후 이용 가능합니다.</p>
                        </div>
                    ) : cartItems.length > 0 ? (
                        <div className="cart-grid">
                            <div className="cart-items">
                                {cartItems.map((item) => (
                                    <div key={item.cino} className="cart-item">
                                        <img
                                            src={item.thumbnailUrl || "/placeholder.png"}
                                            alt={item.gameName || item.equipmentName}
                                        />
                                        <div className="cart-item-info">
                                            <h2>{item.gameName || item.equipmentName}</h2>
                                            {item.gameDescription && <p>{item.gameDescription}</p>}
                                            {item.equipmentDescription && <p>{item.equipmentDescription}</p>}
                                            <div className="cart-item-pricing">
                                                <span className="price">
                                                    ₩{item.price?.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            className="remove-button"
                                            onClick={() => handleRemove(item.appId, item.type)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="cart-summary">
                                <h3>Estimated Total</h3>
                                <p className="total-price">
                                    ₩{totalPrice.toLocaleString()}
                                </p>
                                <button className="purchase-btn" onClick={handlePurchaseAll}>
                                    전체 결제
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="empty-cart">
                            <p>장바구니가 비어 있습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Cart;
