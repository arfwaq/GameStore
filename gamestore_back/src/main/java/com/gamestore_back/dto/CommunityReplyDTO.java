package com.gamestore_back.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommunityReplyDTO {
    private Long comRno;

    @NotNull
    private Long communityComId;//해당 게시글의 comId로 연결

    @NotEmpty
    private String comReplyText;

    @NotEmpty
    private String comReplyer;

    @JsonFormat(pattern="yyyy--MM-dd HH:mm:ss")
    private LocalDateTime regDate;

    @JsonIgnore //json으로 변환할 때 제외하도록 한다.
    private LocalDateTime modDate;
}
