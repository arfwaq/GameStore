package com.gamestore_back.controller;

import com.gamestore_back.domain.CommunityReply;
import com.gamestore_back.dto.CommunityDTO;
import com.gamestore_back.dto.CommunityReplyDTO;
import com.gamestore_back.dto.PageRequestDTO;
import com.gamestore_back.dto.PageResponseDTO;
import com.gamestore_back.service.CommunityReplyService;
import com.gamestore_back.service.CommunityService;
import com.gamestore_back.util.CustomFileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@Log4j2
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/community")   //localhost:8080/community
@RequiredArgsConstructor
public class CommunityController {
    private final CustomFileUtil fileUtil;
    private final CommunityService communityService;
    private final CommunityReplyService communityReplyService;


    @GetMapping({"/{comId}", "/read/{comId}"})
    public CommunityDTO get(@PathVariable(name="comId") Long comId){
        return communityService.getOne(comId);
    }

    @GetMapping("/list")// localhost:8080/community/list
    public PageResponseDTO<CommunityDTO> list(PageRequestDTO pageRequestDTO){
        log.info(pageRequestDTO);
        return communityService.getList(pageRequestDTO);
    }

    // 댓글수 전달
    @GetMapping("/replyCount/{comId}")
    public Long countReply(@PathVariable(name="comId") Long comId){
      CommunityDTO communityDTO = communityService.getOne(comId);
      return communityService.countReply(communityDTO);
    }



    @GetMapping("/register")
    public void registerGET(){

    }


    @PostMapping("/add")
//    public Map<String, Long> register(@RequestParam CommunityDTO communityDTO){
    public Map<String, Long> register(@ModelAttribute CommunityDTO communityDTO
                                      ,@RequestParam(value = "files", required = false) List<MultipartFile> files
    ) {

        log.info("Received CommunityDTO: " + communityDTO);
//        파일 업로드가 있는 경우 처리

            if (files != null && !files.isEmpty()) {

                List<MultipartFile> file = communityDTO.getFiles();
                List<String> uploadFileNames = fileUtil.saveFiles(file);

                communityDTO.setUploadFileNames(uploadFileNames);  // 업로드된 파일 이름을 DTO에 설정
                log.info("Uploaded files: " + uploadFileNames);
            }

        Long comId = communityService.register(communityDTO);
        return Map.of("comId", comId);
    }

    @GetMapping("/view/{fileName}")
    public ResponseEntity<Resource> viewFileGET(@PathVariable String fileName){

        return fileUtil.getFile(fileName);

    }

    @PutMapping("/{comId}")
      public Map<String, String> modify(
      @PathVariable(name="comId") Long comId, CommunityDTO communityDTO) {
        communityDTO.setComId(comId);
        log.info("Modify: " + communityDTO);
        CommunityDTO oldCommunityDTO=communityService.getOne(comId);

        //기존 파일들
        List<String> oldFileNames=oldCommunityDTO.getUploadFileNames();
        //새로 업로드 해야하는 파일들
        List<MultipartFile> files = communityDTO.getFiles();
      if (files == null) {
        files = new ArrayList<>();
      }
        //새로 업로드되어서 만들어진 파일 이름들
        List<String> currentUploadFileNames = fileUtil.saveFiles(files);

        //화면에서 변화 없이 계속 유지된 파일들
        List<String> uploadedFileNames = communityDTO.getUploadFileNames();

        //유지되는 파일들  + 새로 업로드된 파일 이름들이 저장해야 하는 파일 목록이 됨
        if(currentUploadFileNames != null && currentUploadFileNames.size() > 0) {

            uploadedFileNames.addAll(currentUploadFileNames);

        }

        // 수정 처리 로직
        communityService.modify(communityDTO);

        if(oldFileNames != null && oldFileNames.size() > 0){

            //지워야 하는 파일 목록 찾기
            //예전 파일들 중에서 지워져야 하는 파일이름들
            List<String> removeFiles =  oldFileNames
              .stream()
              .filter(fileName -> uploadedFileNames.indexOf(fileName) == -1).collect(Collectors.toList());

            //실제 파일 삭제
            fileUtil.deleteFiles(removeFiles);
        }
        return Map.of("RESULT", "SUCCESS");
    }


    @DeleteMapping("/{comId}")
    public Map<String, String> remove(@PathVariable(name="comId") Long comId) {
        log.info("Remove:"+comId);
        //삭제할 파일
        List<String> oldFileNames = communityService.getOne(comId).getUploadFileNames();
        communityService.remove(comId);
        fileUtil.deleteFiles(oldFileNames);
        return Map.of("RESULT", "SUCCESS");
    }

  public CommunityReplyDTO replyToDTO(CommunityReply communityReply) {
    return CommunityReplyDTO.builder()
      .comRno(communityReply.getComRno())
      .communityComId(communityReply.getCommunity().getComId())  // community에서 comId 추출
      .comReplyText(communityReply.getComReplyText())
      .comReplyer(communityReply.getComReplyer())
      .regDate(communityReply.getRegDate())
      .modDate(communityReply.getModDate()) // 이 필드는 @JsonIgnore로 제외되지만, 직접 설정 가능
      .build();
  }

  // 댓글 리스트
  @GetMapping("/replyList/{comId}")
  public PageResponseDTO<CommunityReplyDTO> getList(
    @PathVariable(name="comId")Long commuComId,
    PageRequestDTO pageRequestDTO){
    PageResponseDTO<CommunityReplyDTO> responseDTO=communityReplyService.getListOfReply(commuComId,pageRequestDTO);
    return responseDTO;
  }

  //  댓글 등록
  @PostMapping("/reply/add")
  public Map<String, Long> postAddReply(@RequestBody CommunityReplyDTO communityReplyDTO){
    Long comRno = communityReplyService.register(communityReplyDTO);
    return Map.of("comRno", comRno);
  }

  //댓글 조회
  @GetMapping("/reply/{comRno}")
  public CommunityReplyDTO getReply(@PathVariable(name="comRno") Long comRno){
    return communityReplyService.read(comRno);
  }

  //댓글 수정
  @PutMapping("/reply/modify/{comRno}")
  public Map<String, String> putReply(@PathVariable Long comRno, @RequestBody CommunityReplyDTO communityReplyDTO){
    try {
      communityReplyDTO.setComRno(comRno);
      log.info("modify: " + communityReplyDTO);

      // 댓글 수정
      communityReplyService.modify(communityReplyDTO);

      // 수정 성공
      return Map.of("Result", "Success");

    } catch (RuntimeException e) {
      // 댓글이 없을 경우
      return Map.of("Result", "Failure", "Message", "Reply not found");
    }



  }

  // 댓글 삭제
  @DeleteMapping("/reply/delete/{comRno}")
  public Map<String, String> deleteReply( @PathVariable Long comRno){
    log.info("deleteReply: " + comRno);
    communityReplyService.remove(comRno);
    return Map.of("Result", "Success");
  }



}
