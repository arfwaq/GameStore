package com.gamestore_back.controller;

import com.gamestore_back.dto.RefundResponseDTO;
import com.gamestore_back.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자 전용 환불 관리 컨트롤러
 *  - 대기 중인 환불 목록 조회
 *  - 환불 승인
 *  - 환불 거절
 */
@RestController
@RequestMapping("/admin/refunds")
@RequiredArgsConstructor
public class RefundController {

    private final RefundService refundService;

    /**
     * [GET] /admin/refunds
     *  -> 대기 중(PENDING)인 환불 요청 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<RefundResponseDTO>> getPendingRefundRequests() {
        List<RefundResponseDTO> pendingRefunds = refundService.getPendingRefundRequests();
        return ResponseEntity.ok(pendingRefunds);
    }

    /**
     * [POST] /admin/refunds/{refundId}/approve
     *  -> 특정 환불 요청 승인
     */
    @PostMapping("/{refundId}/approve")
    public ResponseEntity<String> approveRefund(@PathVariable Long refundId) {
        refundService.approveRefund(refundId);
        return ResponseEntity.ok("환불 요청이 승인되었습니다.");
    }

    /**
     * [POST] /admin/refunds/{refundId}/reject
     *  -> 특정 환불 요청 거절
     */
    @PostMapping("/{refundId}/reject")
    public ResponseEntity<String> rejectRefund(@PathVariable Long refundId) {
        refundService.rejectRefund(refundId);
        return ResponseEntity.ok("환불 요청이 거절되었습니다.");
    }

    /*
       (참고) 환불 생성(사용자 요청) 로직은
       보통 "/api/refunds"처럼 별도 경로(또는 Order/RefundController)에서
       POST로 처리하는 경우가 많음.
       여기서는 관리자 전용 기능만 구현.
    */
}
