package com.gamestore_back.service;

import com.gamestore_back.domain.Cart;
import com.gamestore_back.domain.CartItem;
import com.gamestore_back.domain.Game;
import com.gamestore_back.domain.Player;
import com.gamestore_back.dto.CartItemDTO;
import com.gamestore_back.dto.CartItemListDTO;
import com.gamestore_back.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final GameRepository gameRepository;
    private final PlayerRepository playerRepository;

    //======================================
    // "B" 방식: (email, app_id)로 삭제
    //======================================
    public List<CartItemListDTO> removeByAppId(String email, Long appId) {
        log.info("removeByAppId() called => email: {}, appId: {}", email, appId);

        // 1) (email, appId)로 CartItem 찾기
        CartItem target = cartItemRepository.getItemByAppId(email, appId);

        if (target != null) {
            // 2) 찾았다면 삭제
            cartItemRepository.delete(target);
            log.info("Deleted CartItem cino={}, for email={}, appId={}",
                    target.getCino(), email, appId);
        } else {
            log.warn("CartItem not found for email={}, appId={}", email, appId);
        }

        // 3) 삭제 후, 최신 장바구니 목록을 반환
        return cartItemRepository.getItemsOfCartDTOByEmail(email);
    }

    @Override
    public List<CartItemListDTO> addOrModify(CartItemDTO cartItemDTO) {
        String email = cartItemDTO.getEmail();
        Long appId = cartItemDTO.getApp_id();
        Long cino = cartItemDTO.getCino(); // cino는 이제 수정 로직 외에는 안씀

        log.info("addOrModify() => email: {}, appId: {}, cino: {}", email, appId, cino);

        // (A) 만약 "수정"을 위해 cino가 쓰이고 있으면 남겨두어도 되지만
        //     지금은 딱히 수정 로직이 없으니 대부분 "새 항목 추가" 용도

        // 1) Cart를 찾거나, 없으면 새로 생성
        Cart cart = getOrCreateCart(email);

        // 2) Game 엔티티 확인
        Game game = gameRepository.findById(appId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found with appId: " + appId));

        // 3) 이미 존재하는 항목인지 확인
        CartItem existingCartItem = cartItemRepository.getItemByAppId(email, appId);
        if (existingCartItem == null) {
            // 3-1) 없으면 새 항목 추가
            CartItem newCartItem = CartItem.builder()
                    .game(game)
                    .cart(cart)
                    .build();
            cartItemRepository.save(newCartItem);
        } else {
            // 3-2) 이미 있으면? 수량이나 다른 필드가 있으면 수정,
            //      지금 예시엔 필드가 없으므로 로그만 찍거나 무시
            log.info("CartItem already exists for email={}, appId={}", email, appId);
        }

        // 4) 최신 장바구니 목록 반환
        return getCartItems(email);
    }

    @Override
    public void clearCart(String email) {
        log.info("clearCart() called for email={}", email);

        // 이메일로 장바구니 조회
        Optional<Cart> optionalCart = cartRepository.getCartOfMember(email);
        if (optionalCart.isPresent()) {
            Cart cart = optionalCart.get();
            cart.getItems().clear(); // 장바구니 아이템 리스트 비우기
            cartRepository.save(cart); // 변경사항 저장
            log.info("장바구니 초기화 완료: email={}", email);
        } else {
            log.warn("장바구니를 찾을 수 없음: email={}", email);
        }
    }



    @Override
    public List<CartItemListDTO> getCartItems(String email) {
        return cartItemRepository.getItemsOfCartDTOByEmail(email);
    }

    //======================================
    // 기존 cino로 삭제하던 remove()는 "B" 방식에서는 사용 X
    // => 필요 없으면 제거하거나 주석 처리
    //======================================
    @Override
    public List<CartItemListDTO> remove(Long cino) {
        throw new UnsupportedOperationException("remove(cino) is not used in approach B");
    }

    //======================================
    // 이메일로 Cart를 조회 (없으면 생성)
    //======================================
    private Cart getOrCreateCart(String email) {
        Optional<Cart> optionalCart = cartRepository.getCartOfMember(email);
        if (optionalCart.isPresent()) {
            return optionalCart.get();
        } else {
            log.info("Creating new cart for email: {}", email);
            Player player = playerRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("No Player found for email: " + email));
            Cart newCart = Cart.builder()
                    .owner(player)
                    .ownerEmail(email)
                    .build();
            return cartRepository.save(newCart);
        }
    }
}

