package com.gamestore_back.service;

import com.gamestore_back.domain.Community;
import com.gamestore_back.domain.CommunityImage;
import com.gamestore_back.dto.CommunityDTO;
import com.gamestore_back.dto.PageRequestDTO;
import com.gamestore_back.dto.PageResponseDTO;
import com.gamestore_back.repository.CommunityReplyRepository;
import com.gamestore_back.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor    // 생성자 자동 주입
@Transactional
public class CommunityServiceImpl implements CommunityService {

    private final CommunityRepository communityRepository;
    private final CommunityReplyService communityReplyService;
    private final CommunityReplyRepository communityReplyRepository;

    @Override
    public PageResponseDTO<CommunityDTO> getList(PageRequestDTO pageRequestDTO) {

        Pageable pageable= PageRequest.of(
          pageRequestDTO.getPage()-1,
          pageRequestDTO.getSize(),
          Sort.by("comId").descending());

//        Page<Community> result=communityRepository.searAll(pageable);
        // 검색 관련 우선 첨삭처리

//        Page<Community> result=communityRepository.findAll(pageable); //검색 들어가면 이 줄 삭제
        Page<Object[]> result = communityRepository.selectList(pageable);


        List<CommunityDTO> dtoList=result.get().map(arr->{
            Community community=(Community)arr[0];
            CommunityImage communityImage=(CommunityImage)arr[1];

            CommunityDTO communityDTO=CommunityDTO.builder()
              .comId(community.getComId())
              .comTitle(community.getComTitle())
              .writer(community.getWriter())
              .comContent(community.getComContent())
              .regDate(community.getRegDate())
              .modDate(community.getModDate())
              .build();

            // 이미지 파일 처리
            if (communityImage != null) {
                // 이미지 파일이 있으면 해당 파일 이름을 리스트에 추가
                String imageStr = communityImage.getFileName();
                communityDTO.setUploadFileNames(List.of(imageStr));
            } else {
                // 이미지 파일이 없으면 빈 리스트 설정
                communityDTO.setUploadFileNames(new ArrayList<>());
            }
            return communityDTO;
        }).collect(Collectors.toList());

        long totalCount=result.getTotalElements();

        return PageResponseDTO.<CommunityDTO>withAll()
          .dtoList(dtoList)
          .totalCount(totalCount)
          .pageRequestDTO(pageRequestDTO)
          .build();

    }
//등록
    @Override
    public Long register(CommunityDTO communityDTO){
        Community community=dtoToEntity(communityDTO);
        Community result= communityRepository.save(community);
        return result.getComId();
    }

    private Community dtoToEntity(CommunityDTO communityDTO){
        Community community=Community.builder()
          .comId(communityDTO.getComId())
          .comTitle(communityDTO.getComTitle())
          .comContent(communityDTO.getComContent())
          .writer(communityDTO.getWriter())
          .build();

        //업로드 처리가 끝난 파일 리스트
        List<String> uploadFileNames = communityDTO.getUploadFileNames();

        if(uploadFileNames == null){
            return community;
        }

        uploadFileNames.stream().forEach(uploadName -> {

            community.addImageString(uploadName);
        });

        return community;
    }

    // 조회
    @Override
    public CommunityDTO getOne(Long comId){
        Optional<Community> result=communityRepository.selectOne(comId);
        Community community=result.orElseThrow();
        CommunityDTO communityDTO=entityToDTO(community);
        return communityDTO;
    }

    private CommunityDTO entityToDTO(Community community) {
        CommunityDTO communityDTO = CommunityDTO.builder()
          .comId(community.getComId())
          .comTitle(community.getComTitle())
          .writer(community.getWriter())
          .comContent(community.getComContent())
          .regDate(community.getRegDate())
          .modDate(community.getModDate())
          .build();
        List<CommunityImage> imageList = community.getImageList();
        if (imageList == null || imageList.size() == 0) {
            return communityDTO;
        }
        List<String> fileNameList = imageList.stream().map(communityImage ->
          communityImage.getFileName()).toList();
        communityDTO.setUploadFileNames(fileNameList);
        return communityDTO;
    }


//수정
    @Override
    public void modify(CommunityDTO communityDTO){
        // step1 - read
        Optional<Community> result=communityRepository.findById(communityDTO.getComId());
        Community community=result.orElseThrow();
        // step2 - change text
        community.change(communityDTO.getComTitle(),communityDTO.getComContent());

        //setp3 - upload file
        community.clearList();
        List<String> uploadFileNames = communityDTO.getUploadFileNames();
        if(uploadFileNames != null && uploadFileNames.size() >0){
            uploadFileNames.stream().forEach(uploadName -> {
                community.addImageString(uploadName);
            });
        }
        communityRepository.save(community);
    }

//삭제
    @Override
    public void remove(Long comId){
        communityRepository.deleteById(comId);
    }


    @Override
    public Long countReply(CommunityDTO communityDTO) {
        Long comId=communityDTO.getComId();
        return communityReplyRepository.countByCommunity(comId);
    }
}
