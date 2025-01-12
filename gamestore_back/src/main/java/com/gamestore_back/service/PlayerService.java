package com.gamestore_back.service;

import com.gamestore_back.domain.Player;
import com.gamestore_back.dto.PlayerDTO;
import com.gamestore_back.dto.PlayerModifyDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Transactional
public interface PlayerService {

    // 기존 메서드
    Player findByEmail(String email);

    void save(Player player);

    PlayerDTO getKakaoPlayer(String accessToken);

    void modifyPlayer(PlayerModifyDTO playerModifyDTO);

    /**
     * 회원가입 처리 메서드
     * @param playerDTO 회원가입 정보
     * @return 결과 메시지를 담은 ResponseEntity
     */
    ResponseEntity<Map<String, String>> registerPlayer(PlayerDTO playerDTO);

    default PlayerDTO entityToDTO(Player player) {
        return new PlayerDTO(
                player.getEmail(),
                player.getPw(),
                player.getNickname(),
                player.isSocial(),
                player.getPlayerRoleList().stream().map(playerRole -> playerRole.name()).toList()
        );
    }
}
