package com.gamestore_back.dto;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class PlayerDTO extends User {

    private String email;

    private String pw;

    private String nickname;

    private boolean social;

    private List<String> roleNames = new ArrayList<>(); // 기본값 추가

    public PlayerDTO(String email, String pw, String nickname, boolean social, List<String> roleNames) {
        super(
                email,
                pw,                             // Security에서 권한을 나타내는 기본 구현체
                roleNames.stream().map(str -> new SimpleGrantedAuthority("ROLE_" + str)).collect(Collectors.toList()));

        this.email = email;
        this.pw = pw;
        this.nickname = nickname;
        this.social = social;
        this.roleNames = roleNames;
    }

    public Map<String, Object> getClaims() {

        Map<String, Object> dataMap = new HashMap<>();

        dataMap.put("email", email);
        dataMap.put("pw", pw);
        dataMap.put("nickname", nickname);
        dataMap.put("social", social);
        dataMap.put("roleNames", roleNames);

        return dataMap;
    }

}
