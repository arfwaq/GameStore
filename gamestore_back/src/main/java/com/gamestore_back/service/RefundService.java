package com.gamestore_back.service;

import com.gamestore_back.dto.RefundRequestDTO;
import com.gamestore_back.dto.RefundResponseDTO;

import java.util.List;

public interface RefundService {

    // 사용자 환불 요청 생성
    void createRefundRequest(RefundRequestDTO refundRequestDTO);

    // 관리자: 대기 중인 환불 요청 목록 조회
    List<RefundResponseDTO> getPendingRefundRequests();

    // 관리자: 환불 요청 승인
    void approveRefund(Long refundId);

    // 관리자: 환불 요청 거절
    void rejectRefund(Long refundId);
}
