package com.gamestore_back.service;

import com.gamestore_back.dto.CommunityReplyDTO;
import com.gamestore_back.dto.PageRequestDTO;
import com.gamestore_back.dto.PageResponseDTO;
import org.springframework.data.domain.Pageable;

public interface CommunityReplyService {
  Long register(CommunityReplyDTO communityReplyDTO);
  CommunityReplyDTO read(Long comRno);
  void modify(CommunityReplyDTO communityReplyDTO);
  void remove(Long comRno);
  PageResponseDTO<CommunityReplyDTO> getListOfReply(Long comId, PageRequestDTO pageRequestDTO);
  Long countReplyByComId(Long comId, Pageable pageable);
}
