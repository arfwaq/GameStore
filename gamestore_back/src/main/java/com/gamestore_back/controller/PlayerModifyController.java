package com.gamestore_back.controller;

import com.gamestore_back.domain.Player;
import com.gamestore_back.domain.PlayerRole;
import com.gamestore_back.dto.PlayerModifyDTO;
import com.gamestore_back.service.PlayerService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/player")
public class PlayerModifyController {

    @Autowired
    private PlayerService playerService;

    @Autowired
    private PasswordEncoder passwordEncoder; // PlayerSecurityConfig에서 등록된 PasswordEncoder Bean 사용

    @PutMapping("/modify-pw")
    public ResponseEntity<String> modifyPassword(@RequestBody PasswordChangeRequest request) {
        try {
            PlayerModifyDTO playerModifyDTO = new PlayerModifyDTO();
            playerModifyDTO.setEmail(request.getEmail());
            playerModifyDTO.setCurrentPassword(request.getCurrentPassword());
            playerModifyDTO.setPw(request.getNewPassword());

            playerService.modifyPlayer(playerModifyDTO);

            return ResponseEntity.ok("비밀번호가 성공적으로 변경되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("비밀번호 변경 중 오류가 발생했습니다.");
        }
    }



    @PutMapping("/modify")
    public ResponseEntity<Map<String, String>> modifyPlayer(@RequestBody PlayerModifyDTO playerModifyDTO) {
        try {
            playerService.modifyPlayer(playerModifyDTO);
            return ResponseEntity.ok(Map.of("result", "Player 정보가 수정되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", "회원 정보 수정 중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/info/{email}")
    public ResponseEntity<PlayerDTO> getPlayerInfo(@PathVariable String email) {
        try {
            Player player = playerService.findByEmail(email);
            if (player == null) {
                return ResponseEntity.badRequest().body(null);
            }
            PlayerDTO playerDTO = new PlayerDTO(
                    player.getEmail(),
                    "******", // 비밀번호는 숨김 처리
                    player.getNickname(),
                    player.isSocial(),
                    player.getPlayerRoleList().stream().map(PlayerRole::name).toList()
            );
            return ResponseEntity.ok(playerDTO);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    // 비밀번호 변경 요청 DTO
    @Data
    public static class PasswordChangeRequest {
        private String email;
        private String password;
        private String currentPassword; // 현재 비밀번호 추가
        private String newPassword;     // 새 비밀번호 추가
    }

    // Player 정보 DTO
    @Data
    @AllArgsConstructor
    public static class PlayerDTO {
        private String email;
        private String password;
        private String nickname;
        private boolean social;
        private List<String> roles;
    }
}
