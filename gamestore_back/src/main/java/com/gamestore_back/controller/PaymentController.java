//package com.gamestore_back.controller;
//
//import com.gamestore_back.dto.PaymentDTO;
//import com.gamestore_back.service.PaymentService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("api/payments")
//@RequiredArgsConstructor
//public class PaymentController {
//
//    private final PaymentService paymentService;
//
//    // 결제 처리
//    @PostMapping
//    public ResponseEntity<PaymentDTO> processPayment(@RequestBody PaymentDTO paymentDTO) {
//        PaymentDTO processedPayment = paymentService.processPayment(paymentDTO);
//        return ResponseEntity.ok(processedPayment);
//    }
//}
