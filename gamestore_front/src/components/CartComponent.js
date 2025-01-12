import React, { useEffect, useMemo } from "react";
import useCustomLogin from "../../hooks/useCustomLogin";
import useCustomCart from "../../hooks/useCustomCart";

const CartComponent = () => {
  const { isLogin, loginState } = useCustomLogin();
  const { refreshCart, cartItems, changeCart } = useCustomCart();


  // 로그인 상태일 때 장바구니 데이터 새로고침
  useEffect(() => {
    if (isLogin) {
      refreshCart();
    }
  }, [isLogin, refreshCart]);

  return (
      <div className="w-full">
        {isLogin ? (
            <div className="flex flex-col">
              {/* 사용자 이름과 장바구니 아이템 개수 */}
              <div className="w-full flex">
                <div className="font-extrabold text-2xl w-4/5">
                  {loginState.nickname}'s Cart
                </div>
                <div className="bg-orange-600 text-center text-white font-bold w-1/5 rounded-full m-1">
                  {cartItems.length}
                </div>
              </div>

              {/* 총합 표시 */}
              <div>
                <div className="text-2xl text-right font-extrabold">
                  TOTAL: {total} 원
                </div>
              </div>
            </div>
        ) : (
            <p>로그인이 필요합니다.</p>
        )}
      </div>
  );
};

export default CartComponent;
