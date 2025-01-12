package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Table(name="community")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude="imageList")
public class Community extends BaseEntity{

    @Id // com_id가 기본키
    @GeneratedValue(strategy= GenerationType.IDENTITY)  //키 생성 전략을 DB설정에게 따르겠다.
    @Column(name="com_Id")
    private Long comId;

    @Column(length=100, nullable=false)
    private String comTitle;

    @Column(length=2000, nullable=false)
    private String comContent;

    @Column(length=50, nullable=false)
    private String writer;
    // 추후에 id 또는 닉네임과 연결

    @Builder.Default
    private Long replyCount=0L;

    @OneToMany(mappedBy = "community", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<CommunityReply> replyList;


    public void change(String comTitle, String comContent){
        this.comTitle = comTitle;
        this.comContent = comContent;
    }



    @ElementCollection// 엔티티의 값 타입 컬렉션을 저장할때 사용.
    @Builder.Default// 매핑관계를 맺지않고 단순한 타입으로 처리하겠다.
    private List<CommunityImage> imageList = new ArrayList<>();

    public void addImage(CommunityImage image) {

        image.setOrd(this.imageList.size());
        imageList.add(image);
    }

    public void addImageString(String fileName){

        CommunityImage communityImage = CommunityImage.builder()
                .fileName(fileName)
                .build();
        addImage(communityImage);

    }

    public void clearList() {
        this.imageList.clear();
    }


}
