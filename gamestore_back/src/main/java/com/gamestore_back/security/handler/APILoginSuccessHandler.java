package com.gamestore_back.security.handler;

import com.gamestore_back.dto.PlayerDTO;
import com.gamestore_back.util.JWTUtil;
import com.google.gson.Gson;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

@Log4j2
public class APILoginSuccessHandler implements AuthenticationSuccessHandler{

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException, ServletException{
        log.info("-------------------------------");
        log.info(authentication);
        log.info("-------------------------------");

        PlayerDTO playerDTO = (PlayerDTO)authentication.getPrincipal();

        // 사용자의 추가적인 클레임 정보를 가져오는 용도
        // 추가적인 정보: 사용자의 역할, 권한,  사용자 정의 속성 등
        Map<String, Object> claims  = playerDTO.getClaims();
        claims.put("roleNames", playerDTO.getRoleNames()); // roleNames 추가

        // jwt토큰 생성과 메서드 처리
        String accessToken = JWTUtil.generateToken(claims, 60);
        String refreshToken = JWTUtil.generateToken(claims,60*24);

        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);
        //---------------------------------------------

        Gson gson = new Gson();

        String jsonStr = gson.toJson(claims);

        response.setContentType("application/json; charset=UTF-8");
        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.close();
    }
}
