package com.gamestore_back.service;

import com.gamestore_back.dto.LoveItemDTO;
import com.gamestore_back.dto.LoveItemListDTO;
import jakarta.transaction.Transactional;

import java.util.List;

@Transactional
public interface LoveService {

    // 장바구니 아이템 추가 혹은 변경
    List<LoveItemListDTO> addOrModify(LoveItemDTO loveItemDTO);

    // 모든 장바구니 아이템 목록 조회
    List<LoveItemListDTO> getLoveItems(String email);

    // 특정 장바구니 아이템 삭제
    List<LoveItemListDTO> remove(Long cino);

    boolean checkLoveExists(String email, Long appId);

}
