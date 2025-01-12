package com.gamestore_back.controller;

import com.gamestore_back.dto.OrderDTO;
import com.gamestore_back.dto.RefundRequestDTO;
import com.gamestore_back.service.OrderService;
import com.gamestore_back.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final RefundService refundService; // 환불 서비스 추가

    // 주문 생성
    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO orderDTO) {
        OrderDTO createdOrder = orderService.createOrder(orderDTO);
        return ResponseEntity.ok(createdOrder);
    }

    // 특정 유저의 주문 내역 조회
    @GetMapping
    public ResponseEntity<List<OrderDTO>> getOrdersByPlayer(@RequestParam String email) {
        List<OrderDTO> orders = orderService.getOrdersByPlayer(email);
        return ResponseEntity.ok(orders);
    }

    // 삭제 요청 생성
    @PostMapping("/{orderId}/refund")
    public ResponseEntity<String> requestRefund(@PathVariable Long orderId) {
        RefundRequestDTO refundRequestDTO = orderService.createRefundRequest(orderId);
        return ResponseEntity.ok("환불 요청이 성공적으로 생성되었습니다.");
    }
}
