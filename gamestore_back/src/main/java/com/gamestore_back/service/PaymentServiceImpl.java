//package com.gamestore_back.service;
//
//import com.gamestore_back.domain.Order;
//import com.gamestore_back.domain.Payment;
//import com.gamestore_back.dto.PaymentDTO;
//import com.gamestore_back.repository.OrderRepository;
//import com.gamestore_back.repository.PaymentRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//
//@Service
//@RequiredArgsConstructor
//@Transactional
//public class PaymentServiceImpl implements PaymentService {
//
//    private final PaymentRepository paymentRepository;
//    private final OrderRepository orderRepository;
//
//    @Override
//    public PaymentDTO processPayment(PaymentDTO paymentDTO) {
//        Order order = orderRepository.findById(paymentDTO.getOrderId())
//                .orElseThrow(() -> new IllegalArgumentException("Order not found: " + paymentDTO.getOrderId()));
//
//        if (paymentRepository.existsById(paymentDTO.getOrderId())) {
//            throw new IllegalStateException("Payment already exists for this order: " + paymentDTO.getOrderId());
//        }
//
//        Payment payment = Payment.builder()
//                .order(order)
//                .paymentAmount(paymentDTO.getPaymentAmount())
//                .paymentDate(LocalDateTime.now())
//                .build();
//
//        Payment savedPayment = paymentRepository.save(payment);
//
//        return new PaymentDTO(
//                savedPayment.getOrder().getOrderId(),
//                savedPayment.getPaymentAmount(),
//                savedPayment.getPaymentDate()
//        );
//    }
//}