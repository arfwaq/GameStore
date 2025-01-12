package com.gamestore_back.controller;

import com.gamestore_back.dto.InquiryDTO;
import com.gamestore_back.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/inquiries")
public class InquiryController {

    private final InquiryService inquiryService;

    @Autowired
    public InquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_USER')") // USER 권한만 접근 가능
    public ResponseEntity<InquiryDTO> createInquiry(@RequestBody InquiryDTO inquiryDTO) {
        InquiryDTO createdInquiry = inquiryService.saveInquiry(inquiryDTO);
        return ResponseEntity.ok(createdInquiry);
    }
}

