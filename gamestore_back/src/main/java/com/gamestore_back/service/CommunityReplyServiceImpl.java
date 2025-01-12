package com.gamestore_back.service;

import com.gamestore_back.domain.Community;
import com.gamestore_back.domain.CommunityReply;
import com.gamestore_back.dto.CommunityReplyDTO;
import com.gamestore_back.dto.PageRequestDTO;
import com.gamestore_back.dto.PageResponseDTO;
import com.gamestore_back.repository.CommunityReplyRepository;
import com.gamestore_back.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Log4j2
public class CommunityReplyServiceImpl implements CommunityReplyService {
  private final CommunityRepository communityRepository;
  private final CommunityReplyRepository communityReplyRepository;
  private final ModelMapper modelMapper;

  @Override
  public Long register(CommunityReplyDTO communityReplyDTO) {

    // 1. DTO에서 받아온 communityComId 값이 올바르게 설정되었는지 확인
    Long communityComId = communityReplyDTO.getCommunityComId();

    // 2. communityComId 값을 이용해 해당 Community 엔티티가 있는지 확인
    Community community = communityRepository.findById(communityComId)
      .orElseThrow(() -> new RuntimeException("Community not found for ID " + communityComId));

    // 3. DTO를 도메인 객체로 변환, 빌더 패턴을 사용하여 communityComId 설정
    CommunityReply communityReply = CommunityReply.builder()
      .comReplyText(communityReplyDTO.getComReplyText())
      .comReplyer(communityReplyDTO.getComReplyer())
      .community(community) // 빌더로 communityComId 설정
      .build();

    // 4. 댓글 저장
    communityReplyRepository.save(communityReply);

    // 5. 저장된 댓글의 ID 반환
    return communityReply.getComRno();
  }

  @Override
  public CommunityReplyDTO read(Long comRno) {
    Optional<CommunityReply> communityReplyOptional = communityReplyRepository.findById(comRno);
    CommunityReply communityReply = communityReplyOptional.orElseThrow();
    return modelMapper.map( communityReply, CommunityReplyDTO.class);
  }

  @Transactional
  @Override
  public void modify(CommunityReplyDTO communityReplyDTO) {
    Optional<CommunityReply> communityReplyOptional = communityReplyRepository.findById(communityReplyDTO.getComRno());
    CommunityReply communityReply = communityReplyOptional.orElseThrow();
    communityReply.changeText(communityReplyDTO.getComReplyText());      // 댓글의 내용만 수정 가능
    communityReplyRepository.save(communityReply);
  }

  @Override
  public void remove(Long comRno) {
    communityReplyRepository.deleteById(comRno);
  }

  @Override
  public PageResponseDTO<CommunityReplyDTO> getListOfReply(Long comId, PageRequestDTO pageRequestDTO) {
    //페이지 설정
    Pageable pageable=
      PageRequest.of(pageRequestDTO.getPage() <=0? 0: pageRequestDTO.getPage()-1,
        pageRequestDTO.getSize(),
        Sort.by("comRno").descending());

    //댓글 목록 조회
    Page<CommunityReply> result=communityReplyRepository.listOfReply(comId,pageable);

    //댓글 목록을 DTO로 변환
    List<CommunityReplyDTO> dtoList=result.getContent().stream()
      .map(communityReply->
      {CommunityReplyDTO communityDTO= modelMapper.map(communityReply, CommunityReplyDTO.class);
        communityDTO.setCommunityComId(communityReply.getCommunity().getComId());
      return communityDTO;
      })
      .collect(Collectors.toList());

    long totalCount=result.getTotalElements();

    return PageResponseDTO.<CommunityReplyDTO>withAll()
      .pageRequestDTO(pageRequestDTO)
      .dtoList(dtoList)
      .totalCount(totalCount)
      .build();
  }

  @Override
  public Long countReplyByComId(Long comId, Pageable pageable) {
    return communityReplyRepository.countByCommunity(comId);
  }

}
