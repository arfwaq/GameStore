package com.gamestore_back.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PageRequestDTO {

    @Builder.Default
    private int page = 1;

    @Builder.Default
    private int size = 10;

    private String link;

    public Pageable getPageable(String...props){
        return PageRequest.of(this.page-1,
                this.size, Sort.by(props).descending());
    }

    public String getLink(){
        if(link==null){ // link 값이 비어있으면 생성, 이미 있으면 기존값 반환
            StringBuilder builder=new StringBuilder();  //String보다 가변처리에 성능 좋음
            builder.append("page="+this.page);
            builder.append("&size="+this.size);
            link=builder.toString();    //link를 String으로 반환(타입 일치)
        }
        return link;
    }

}
