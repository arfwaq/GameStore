package com.gamestore_back.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommunityDTO {
    private Long comId;

    @NotEmpty
    @Size(min=3, max=100)
    private String comTitle;

    @NotEmpty
    private String comContent;

    @NotEmpty
    private String writer;
    private LocalDateTime regDate;
    private LocalDateTime modDate;

    @Builder.Default		// 서버에 보내지는 실제 파일 데이터 이름들을 위한 리스트
    private List<MultipartFile> files = new ArrayList<>();

    @Builder.Default		// 업로드가 완료된 파일의 이름만 문자열로 보관하기 위한 리스트
    private List<String> uploadFileNames = new ArrayList<>();

//    @Builder.Default
//    private long replyCount = 0;

}
