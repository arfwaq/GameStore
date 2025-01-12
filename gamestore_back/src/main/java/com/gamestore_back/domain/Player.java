package com.gamestore_back.domain;

import com.gamestore_back.domain.PlayerRole;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@ToString (exclude = "playerRoleList")
public class Player {

    @Id
    private String email;

    private String pw;

    private String nickname;

    private boolean social;

    @ElementCollection(fetch = FetchType.LAZY)
    @Builder.Default
    private List<PlayerRole> playerRoleList = new ArrayList<>();

    public void addRole(PlayerRole playerRole){
        playerRoleList.add(playerRole);
    }

    public void clearRole(){
        playerRoleList.clear();
    }

    public void changeNickname(String nickname) {
        this.nickname = nickname;
    }

    public void changePw(String pw){
        this.pw = pw;
    }

    public void changeSocial(boolean social) {
        this.social = social;
    }
}
