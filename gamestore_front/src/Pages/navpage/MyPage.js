import React, { useEffect, useState } from 'react';
import { getOrdersByPlayer, requestRefund } from '../../api/OrderApi';
import { getloveItems, removeloveItem } from '../../api/LoveApi';
import Navbar from '../../components/Navbar';
import LikeButton from '../../components/LikeButton';
import "../../css/mypage.css";
import { useNavigate } from "react-router-dom";

import { getCartItems as getGameCartItems } from "../../api/cartApi"; // 장바구니 API 가져오기
import EqCartApi from "../../api/EqCartApi"; // 장비 카트 API

const Mypage = () => {
    const [orders, setOrders] = useState([]);
    const [purchasedGames, setPurchasedGames] = useState([]);     // 구매한 "게임"만
    const [purchasedEquipments, setPurchasedEquipments] = useState([]); // 구매한 "장비"만
    const [lovedGames, setLovedGames] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [cartItemCount, setCartItemCount] = useState(0); // 카트 아이템 갯수

    useEffect(() => {
        fetchOrders();
        fetchLovedGames();
    }, []);

    const fetchOrders = async () => {
        try {
            const fetchedOrders = await getOrdersByPlayer();
            setOrders(fetchedOrders);
            setError('');

            // 구매한 게임 vs 구매한 장비 분류
            const games = fetchedOrders.filter(order => order.gameName); // or order.appId
            const equipments = fetchedOrders.filter(order => order.equipmentName); // or order.equipmentId

            setPurchasedGames(games);
            setPurchasedEquipments(equipments);

        } catch (err) {
            setError('구매 내역을 불러오는 데 실패했습니다.');
            console.error(err);
        }
    };

    const fetchLovedGames = async () => {
        try {
            const fetchedLovedGames = await getloveItems();
            setLovedGames(fetchedLovedGames);
            setError('');
        } catch (err) {
            setError('');
            console.error(err);
        }
    };

    // 장바구니 아이템 갯수
    useEffect(() => {
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

        fetchCartItemCount();
    }, []);

    const handleCartButtonClick = () => {
        navigate("/cart");
    };

    const handleRefundRequest = async (orderId) => {
        if (!window.confirm('정말 해당 상품을 환불 요청하시겠습니까?')) return;
        try {
            await requestRefund(orderId);
            // 상태 변경
            setOrders(orders.map(order =>
                order.orderId === orderId
                    ? { ...order, status: '환불 요청 중' }
                    : order
            ));
            // purchasedGames 혹은 purchasedEquipments에도 반영 필요
            setPurchasedGames(purchasedGames.map(order =>
                order.orderId === orderId
                    ? { ...order, status: '환불 요청 중' }
                    : order
            ));
            setPurchasedEquipments(purchasedEquipments.map(order =>
                order.orderId === orderId
                    ? { ...order, status: '환불 요청 중' }
                    : order
            ));

            setError('');
        } catch (err) {
            setError('환불 요청에 실패하였습니다.');
            console.error(err);
        }
    };

    const handleDeleteLove = async (appId) => {
        if (!window.confirm('정말 이 게임을 찜 목록에서 삭제하시겠습니까?')) return;
        try {
            await removeloveItem(appId);
            setLovedGames(lovedGames.filter(game => game.appId !== appId));
            setError('');
        } catch (err) {
            setError('찜 항목 삭제에 실패했습니다.');
            console.error(err);
        }
    };

    return (
        <>
            <Navbar />
            <div className="mp_mypage">

                {/* 구매 내역 - GAME */}
                <div className="mp_mypage-section">
                    <h2>구매한 게임</h2>
                    {error && <p className="mp_error-message">{error}</p>}
                    {purchasedGames.length === 0 ? (
                      <p>구매한 게임이 없습니다.</p>
                    ) : (
                      <ul className="mp_game-list">
                          {purchasedGames.map(order => (
                            <li key={order.orderId} className="mp_game-card">
                                <img src={order.thumbnailUrl} alt="썸네일" className="mp_game-thumbnail" />
                                <div className="mp_game-info">
                                    <h3>{order.gameName}</h3>
                                    <p>가격: {order.purchasePrice} 원</p>
                                    <p>주문 날짜: {new Date(order.purchaseDate).toLocaleString()}</p>
                                    <p>상태: {order.status || '정상'}</p>
                                    <button
                                      className="mp_refund-button"
                                      onClick={() => handleRefundRequest(order.orderId)}
                                      disabled={order.status === '환불 요청 중'}
                                    >
                                        {order.status === '환불 요청 중' ? '환불 요청 중' : '환불 요청'}
                                    </button>
                                </div>
                            </li>
                          ))}
                      </ul>
                    )}
                </div>

                {/* 구매 내역 - EQUIPMENT */}
                <div className="mp_mypage-section">
                    <h2>구매한 장비</h2>
                    {purchasedEquipments.length === 0 ? (
                      <p>구매한 장비가 없습니다.</p>
                    ) : (
                      <ul className="mp_game-list">
                          {purchasedEquipments.map(order => (
                            <li key={order.orderId} className="mp_game-card">
                                <img
                                  src={order.equipmentImageUrl || order.thumbnailUrl}
                                  alt="장비썸네일"
                                  className="mp_game-thumbnail"
                                />
                                <div className="mp_game-info">
                                    <h3>{order.equipmentName}</h3>
                                    <p>가격: {order.purchasePrice} 원</p>
                                    <p>주문 날짜: {new Date(order.purchaseDate).toLocaleString()}</p>
                                    <p>상태: {order.status || '정상'}</p>
                                    <button
                                      className="mp_refund-button"
                                      onClick={() => handleRefundRequest(order.orderId)}
                                      disabled={order.status === '환불 요청 중'}
                                    >
                                        {order.status === '환불 요청 중' ? '환불 요청 중' : '환불 요청'}
                                    </button>
                                </div>
                            </li>
                          ))}
                      </ul>
                    )}
                </div>

                {/* 찜한 게임 */}
                <div className="mp_mypage-section">
                    <h2>찜한 게임</h2>
                    {lovedGames.length === 0 ? (
                      <p>찜한 게임이 없습니다.</p>
                    ) : (
                      <ul className="mp_game-list">
                          {lovedGames.map(game => (
                            <li key={game.appId} className="mp_game-card">
                                <img src={game.thumbnailUrl} alt="썸네일" className="mp_game-thumbnail" />
                                <div className="mp_game-info">
                                    <h3>{game.gameName}</h3>
                                    <p>가격: {game.price} 원</p>
                                    <LikeButton appId={game.appId} initialLiked={true} />
                                    <button
                                      className="mp_delete-button"
                                      onClick={() => handleDeleteLove(game.appId)}
                                    >
                                        삭제
                                    </button>
                                </div>
                            </li>
                          ))}
                      </ul>
                    )}
                </div>

                <button
                  className="cart-button"
                  onClick={handleCartButtonClick}
                  title="장바구니"
                >
                    🛒
                    {cartItemCount > 0 && (
                      <div className="cart-item-count">
                          {cartItemCount}
                      </div>
                    )}
                </button>
            </div>
        </>
    );
};

export default Mypage;
