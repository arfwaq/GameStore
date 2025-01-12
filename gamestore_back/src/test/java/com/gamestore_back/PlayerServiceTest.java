package com.gamestore_back;

import com.gamestore_back.repository.PlayerRepository;
import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gamestore_back.domain.Player;
import com.gamestore_back.domain.PlayerRole;

@SpringBootTest
@Log4j2
public class PlayerServiceTest {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Test
    public void testInsertPlayer() {

        for (int i = 0; i < 10; i++) {

            Player player = Player.builder()
                    .email("user" + i + "@aaa.com")
                    .pw(passwordEncoder.encode("1111"))
                    .nickname("USER" + i)
                    .build();

            player.addRole(PlayerRole.USER);

//            if (i >= 5) {
//                player.addRole(PlayerRole.MANAGER);
//            }

            if (i >= 8) {
                player.addRole(PlayerRole.ADMIN);
            }

            playerRepository.save(player);
        }
    }

    @Test
    public void testRead() {

        String email = "user9@aaa.com";

        Player player = playerRepository.getWithRoles(email);

        log.info("-----------------");
        log.info(player);
    }
}
