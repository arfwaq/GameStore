package com.gamestore_back.service;

import com.gamestore_back.dto.CartItemDTO;
import com.gamestore_back.dto.CartItemListDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public interface CartService {

    // 장바구니 아이템 추가 혹은 변경
    List<CartItemListDTO> addOrModify(CartItemDTO cartItemDTO);

    // 모든 장바구니 아이템 목록 조회
    List<CartItemListDTO> getCartItems(String email);

    // 특정 장바구니 아이템 삭제
    List<CartItemListDTO> remove(Long cino);

    void clearCart(String email);

}
