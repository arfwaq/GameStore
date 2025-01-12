package com.gamestore_back.controller;

import com.gamestore_back.dto.PlayerDTO;
import com.gamestore_back.service.PlayerService;
import com.gamestore_back.util.JWTUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
    @Log4j2
    @RequiredArgsConstructor

    public class SocialController {

    private final PlayerService playerService;

    // 카카오 로그인
    @GetMapping("/api/player/kakao")
    public Map<String,Object> getMemberFromKakao(@RequestParam("accessToken") String accessToken) {

        log.info("access Token ");
        log.info(accessToken);

        PlayerDTO playerDTO = playerService.getKakaoPlayer(accessToken);

        Map<String, Object> claims = playerDTO.getClaims();

        String jwtAccessToken = JWTUtil.generateToken(claims, 10);
        String jwtRefreshToken = JWTUtil.generateToken(claims,60*24);

        claims.put("accessToken", jwtAccessToken);
        claims.put("refreshToken", jwtRefreshToken);

        return claims;
    }
}
