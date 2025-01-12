package com.gamestore_back.controller;

import com.gamestore_back.domain.Player;
import com.gamestore_back.dto.PlayerDTO;
import com.gamestore_back.repository.PlayerRepository;
import com.gamestore_back.service.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/player")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PlayerService playerService;

    // GET 요청 처리 (추가)
    @GetMapping("/login")
    public ResponseEntity<String> loginGetNotSupported() {
        return ResponseEntity.status(405).body("GET method is not supported for login. Please use POST.");
    }

    // POST 요청 처리
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String username,
                                   @RequestParam String password) {
        Map<String, Object> response = new HashMap<>();
        try {
            Optional<Player> player = playerRepository.findById(username);

            if (player.isPresent() &&
                    passwordEncoder.matches(password, player.get().getPw())) {

                Player playerInfo = player.get();
                response.put("email", playerInfo.getEmail());
                response.put("nickname", playerInfo.getNickname());
                response.put("social", playerInfo.isSocial());
                response.put("roles", playerInfo.getPlayerRoleList());

                return ResponseEntity.ok(response);
            } else {
                response.put("error", "Invalid credentials");
                return ResponseEntity.status(401).body(response);
            }
        } catch (Exception e) {
            response.put("error", "Login failed: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    // 회원가입 API
    @PostMapping("/make")
    public ResponseEntity<Map<String, String>> makePlayer(@RequestBody PlayerDTO playerDTO) {
        return playerService.registerPlayer(playerDTO);
    }

    // 닉네임 가져오기 API
    @GetMapping("/nickname")
    public ResponseEntity<String> getNickname(@RequestParam String email) {
        Optional<Player> player = playerRepository.findById(email);

        if (player.isPresent()) {
            return ResponseEntity.ok(player.get().getNickname());
        } else {
            return ResponseEntity.badRequest().body("사용자를 찾을 수 없습니다.");
        }
    }

    // 회원정보 조회 API
    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getPlayerProfile(@RequestParam String email) {
        Map<String, Object> response = new HashMap<>();
        try {
            // 이메일 기반으로 플레이어 정보 조회
            Optional<Player> player = playerRepository.findById(email);

            if (player.isPresent()) {
                Player playerInfo = player.get();
                response.put("email", playerInfo.getEmail());
                response.put("nickname", playerInfo.getNickname());
                response.put("social", playerInfo.isSocial());
                response.put("roles", playerInfo.getPlayerRoleList());
                return ResponseEntity.ok(response);
            } else {
                response.put("error", "사용자를 찾을 수 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("error", "회원정보 조회 중 오류가 발생했습니다: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
