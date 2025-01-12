package com.gamestore_back.repository;

import com.gamestore_back.domain.Inquiry;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

//    // 특정 사용자의 문의 조회
//    List<Inquiry> findByPlayer_Email(String email);
// 특정 사용자의 문의를 페이징 처리하여 조회
Page<Inquiry> findByPlayer_Email(String email, Pageable pageable);

}
