package com.gamestore_back.controller;

import com.gamestore_back.domain.EqCartItem;
import com.gamestore_back.dto.eqCartDTO;
import com.gamestore_back.service.EqCartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 장바구니 컨트롤러 예시
 */
@RestController
@RequestMapping("/api/eqcart")
@RequiredArgsConstructor
public class EqCartController {

    private final EqCartService eqCartService;

    @GetMapping
    public ResponseEntity<List<EqCartItem>> getCartItems(@RequestParam String ownerEmail) {
        return ResponseEntity.ok(eqCartService.getCartItems(ownerEmail));
    }

    @PostMapping("/change")
    public ResponseEntity<?> postChangeCart(@RequestParam String ownerEmail, @RequestBody eqCartDTO request) {
        switch (request.getAction().toLowerCase()) {
            case "add":
                eqCartService.addToCart(ownerEmail, request.getEquipment_id(), request.getQuantity());
                return ResponseEntity.ok("장바구니에 추가되었습니다!");
            case "remove":
                eqCartService.removeFromCart(ownerEmail, request.getEquipment_id());
                return ResponseEntity.ok("장바구니에서 제거되었습니다!");
            case "update":
                eqCartService.updateCartQuantity(ownerEmail, request.getEquipment_id(), request.getQuantity());
                return ResponseEntity.ok("장바구니 수량이 변경되었습니다!");
            default:
                return ResponseEntity.badRequest().body("알 수 없는 action입니다.");
        }
    }
}
