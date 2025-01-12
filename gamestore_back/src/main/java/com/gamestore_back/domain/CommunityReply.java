package com.gamestore_back.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude="community")
@Table(name="community_reply")
public class CommunityReply extends BaseEntity{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Long comRno;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="com_Id")
    private Community community;

    private String comReplyText;
    private String comReplyer;

    public void changeText(String comReplyText) {
        this.comReplyText=comReplyText;
    }
}
