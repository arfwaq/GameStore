package com.gamestore_back.controller;

import com.gamestore_back.dto.CartItemDTO;
import com.gamestore_back.dto.CartItemListDTO;
import com.gamestore_back.service.CartService;
import com.gamestore_back.service.CartServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    @PostMapping("/change")
    public List<CartItemListDTO> changeCart(@RequestBody CartItemDTO itemDTO) {
        String email = itemDTO.getEmail();

        if (email == null || email.isEmpty()) {
            throw new RuntimeException("사용자 이메일이 필요합니다.");
        }

        log.info("장바구니 항목 변경 요청: {}, 사용자 이메일: {}", itemDTO, email);

        // (B) "remove" 동작 => (email, app_id)로 삭제
        if ("remove".equalsIgnoreCase(itemDTO.getAction())) {
            return ((CartServiceImpl) cartService).removeByAppId(email, itemDTO.getApp_id());
        }

        // 그 외 => "add" or "modify"
        return cartService.addOrModify(itemDTO);
    }


    @DeleteMapping("/clear")
    public void clearCart(@RequestParam("email") String email) {
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("사용자 이메일이 필요합니다.");
        }
        log.info("장바구니 초기화 요청 => email={}", email);
        cartService.clearCart(email);
    }


    /**
     * 사용자의 장바구니 항목 조회
     */
    @GetMapping("/items")
    public List<CartItemListDTO> getCartItems(@RequestParam("email") String email) {
        if (email == null || email.isEmpty()) {
            throw new RuntimeException("사용자 이메일이 필요합니다.");
        }
        log.info("장바구니 항목 조회 => email={}", email);
        return cartService.getCartItems(email);
    }

    /**
     * (선택) cino 기반 삭제 API
     *  -> "B" 방식에서는 잘 안쓰지만, 필요하면 유지
     */
    @DeleteMapping("/{cino}")
    public List<CartItemListDTO> removeFromCart(
            @PathVariable("cino") Long cino,
            @RequestParam("email") String email) {
        // 만약 "app_id" 방식만 쓰려면 이 API를 지워도 됩니다.
        return cartService.remove(cino);
    }
}
