import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import GameEquipmentsApi from '../api/GameEquipmentsApi';
import '../css/allEquipments.css'; // 일반 CSS 파일 가져오기

import { getCartItems as getGameCartItems } from "../api/cartApi"; // 장바구니 API 가져오기
import EqCartApi from "../api/EqCartApi"; // 장비 카트 API

const AllEquipments = ({ category, limit }) => {
  const [equipments, setEquipments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0); // 카트 아이템 갯수

  const fetchEquipments = async (currentPage) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const data =
          category === '전체'
              ? await GameEquipmentsApi.getAllEquipments(currentPage, limit, '전체', '전체')
              : await GameEquipmentsApi.getEquipmentsByCategory(currentPage, limit, '전체', category);

      setEquipments((prev) => (currentPage === 1 ? data : [...prev, ...data]));
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setEquipments([]);
    setHasMore(true);
    fetchEquipments(1);
  }, [category, limit]);

  useEffect(() => {
    if (page > 1) {
      fetchEquipments(page);
    }
  }, [page]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;

    if (scrollTop + clientHeight >= scrollHeight - 50 && hasMore && !loading) {
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loading]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

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

  //장바구니 버튼
  const handleCartButtonClick = () => {
    navigate("/cart"); // 장바구니 페이지로 이동
  };

  return (
    <div className="container" ref={containerRef}>
      <div className="list">
        {equipments.map((item) => (
          <div key={item.id} className="item">
            <img src={item.imageUrl} alt={item.name} className="image" />
            <div className="details">
              <h3 className="name">{item.name}</h3>
              <p className="price">{item.price ? `${item.price}원` : '가격 미정'}</p>
            </div>
            <button
              className="buyButton"
              onClick={() => navigate(`/equipments/${item.id}`)}
            >
              구매하기
            </button>
          </div>
        ))}
      </div>
      {loading && <div className="loadingSpinner">로딩 중...</div>}
      {!hasMore && !loading && <p>더 이상 데이터가 없습니다.</p>}
      <button
        className="cart-button" onClick={handleCartButtonClick} title="장바구니">
        🛒
        {cartItemCount > 0 && (
          <div className="cart-item-count">
            {cartItemCount}
          </div>
        )}
      </button>
    </div>

  );
};

export default AllEquipments;
