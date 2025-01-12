package com.gamestore_back.service;

import com.gamestore_back.dto.OrderDTO;
import com.gamestore_back.dto.RefundRequestDTO;

import java.util.List;

public interface OrderService {

    // 게임 or 장비 모두 처리 가능
    OrderDTO createOrder(OrderDTO orderDTO);

    List<OrderDTO> getOrdersByPlayer(String email);

    RefundRequestDTO createRefundRequest(Long orderId);
}
