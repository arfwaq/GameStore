package com.gamestore_back.service;

import com.gamestore_back.dto.CommunityDTO;
import com.gamestore_back.dto.PageRequestDTO;
import com.gamestore_back.dto.PageResponseDTO;

public interface CommunityService {
    Long register(CommunityDTO communityDTO);
    CommunityDTO getOne(Long comId);
    void modify(CommunityDTO communityDTO);
    void remove(Long comId);
    PageResponseDTO<CommunityDTO> getList(PageRequestDTO pageRequestDTO);
    Long countReply(CommunityDTO communityDTO);

}
