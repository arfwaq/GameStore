package com.gamestore_back.service;

import com.gamestore_back.domain.Player;
import com.gamestore_back.domain.PlayerRole;
import com.gamestore_back.dto.PlayerDTO;
import com.gamestore_back.dto.PlayerModifyDTO;
import com.gamestore_back.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Log4j2
public class PlayerServiceImpl implements PlayerService {

    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Player findByEmail(String email) {
        return playerRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Player not found with email: " + email));
    }

    @Override
    public void save(Player player) {
        playerRepository.save(player);
    }

    @Override
    public ResponseEntity<Map<String, String>> registerPlayer(PlayerDTO playerDTO) {
        Map<String, String> response = new HashMap<>();

        // 이메일 중복 체크
        if (playerRepository.existsById(playerDTO.getEmail())) {
            response.put("error", "이미 존재하는 이메일입니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 닉네임 유효성 검사: 한글, 영문, 숫자만 허용 (2~8자)
        if (!playerDTO.getNickname().matches("^[가-힣a-zA-Z0-9]{2,8}$")) {
            response.put("error", "닉네임은 한글, 영문, 숫자로 이루어진 2~8자만 허용됩니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 비밀번호 암호화
        String encodedPassword = passwordEncoder.encode(playerDTO.getPw());

        // Player 객체 생성
        Player newPlayer = Player.builder()
                .email(playerDTO.getEmail())
                .pw(encodedPassword)
                .nickname(playerDTO.getNickname())
                .social(playerDTO.isSocial())
                .build();

        // 기본 권한 추가
        newPlayer.addRole(PlayerRole.USER);

        // Player 저장
        playerRepository.save(newPlayer);

        response.put("message", "회원가입이 성공적으로 완료되었습니다!");
        return ResponseEntity.ok(response);
    }


    @Override
    public void modifyPlayer(PlayerModifyDTO playerModifyDTO) {
        Optional<Player> result = playerRepository.findById(playerModifyDTO.getEmail());
        Player player = result.orElseThrow();

        // 현재 비밀번호 확인
        if (!passwordEncoder.matches(playerModifyDTO.getCurrentPassword(), player.getPw())) {
            throw new IllegalArgumentException("Current password does not match");
        }
        // 새 비밀번호가 현재 비밀번호와 동일한지 확인
        if (passwordEncoder.matches(playerModifyDTO.getPw(), player.getPw())) {
            throw new IllegalArgumentException("New password cannot be the same as the current password");
        }
        // 비밀번호 변경
        if (playerModifyDTO.getPw() != null && !playerModifyDTO.getPw().isEmpty()) {
            player.changePw(passwordEncoder.encode(playerModifyDTO.getPw()));
        }

        // 닉네임 변경
        if (playerModifyDTO.getNickname() != null && !playerModifyDTO.getNickname().isEmpty()) {
            player.changeNickname(playerModifyDTO.getNickname());
        }

        // 소셜 여부 변경
        player.changeSocial(playerModifyDTO.isSocial());

        playerRepository.save(player);
    }

    @Override
    public PlayerDTO getKakaoPlayer(String accessToken) {
        String email = getEmailFromKakaoAccessToken(accessToken);

        // 기존 회원 확인
        Optional<Player> result = playerRepository.findById(email);
        if (result.isPresent()) {
            return entityToDTO(result.get());
        }

        // 신규 소셜 회원 생성
        Player socialPlayer = makeSocialPlayer(email);
        playerRepository.save(socialPlayer);
        return entityToDTO(socialPlayer);
    }

    private String getEmailFromKakaoAccessToken(String accessToken) {
        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

        if (accessToken == null || accessToken.isEmpty()) {
            throw new RuntimeException("Access Token is null or empty");
        }

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type", "application/x-www-form-urlencoded");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        UriComponents uriBuilder = UriComponentsBuilder.fromHttpUrl(kakaoGetUserURL).build();
        ResponseEntity<LinkedHashMap> response = restTemplate.exchange(
                uriBuilder.toString(), HttpMethod.GET, entity, LinkedHashMap.class);

        log.info("Kakao API Response: {}", response);
        LinkedHashMap<String, LinkedHashMap> bodyMap = response.getBody();
        log.info("Body Map: {}", bodyMap);

        if (bodyMap == null || !bodyMap.containsKey("kakao_account")) {
            throw new RuntimeException("Failed to retrieve email from Kakao");
        }

        return (String) bodyMap.get("kakao_account").get("email");
    }

    private String makeTempPassword() {
        StringBuilder buffer = new StringBuilder();
        for (int i = 0; i < 10; i++) {
            buffer.append((char) ((int) (Math.random() * 26) + 97)); // 랜덤 소문자 생성
        }
        return buffer.toString();
    }

    private Player makeSocialPlayer(String email) {
        String tempPassword = makeTempPassword();
        log.info("Temporary Password for Social Player: {}", tempPassword);

        Player player = Player.builder()
                .email(email)
                .pw(passwordEncoder.encode(tempPassword))
                .nickname("소셜회원")
                .social(true)
                .build();

        player.addRole(PlayerRole.USER);
        return player;
    }

    @Override
    public PlayerDTO entityToDTO(Player player) {
        return new PlayerDTO(
                player.getEmail(),
                "******", // 비밀번호는 숨김 처리
                player.getNickname(),
                player.isSocial(),
                player.getPlayerRoleList().stream().map(PlayerRole::name).toList()
        );
    }
}
