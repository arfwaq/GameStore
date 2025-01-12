package com.gamestore_back.service;

import com.gamestore_back.domain.EqCartItem;

import java.util.List;

public interface EqCartService {

    // 해당 이메일의 장바구니 아이템 조회
    List<EqCartItem> getCartItems(String ownerEmail);

    // 장바구니에 아이템 추가 (수량까지)
    void addToCart(String ownerEmail, Long equipmentId, int requestedQuantity);

    // 장바구니 아이템 제거
    void removeFromCart(String ownerEmail, Long equipmentId);

    // 장바구니 아이템 수량 업데이트 (직접 지정)
    void updateCartQuantity(String ownerEmail, Long equipmentId, int newQuantity);
}
