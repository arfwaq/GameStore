package com.gamestore_back.service;

import com.gamestore_back.domain.Player;
import com.gamestore_back.domain.PlayerRole;
import com.gamestore_back.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements CommandLineRunner {

    private final PlayerRepository playerRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@admin.com";
        String adminPassword = "admin123"; // 초기 비밀번호

        if (!playerRepository.existsById(adminEmail)) {
            Player admin = Player.builder()
                    .email(adminEmail)
                    .pw(passwordEncoder.encode(adminPassword)) // 비밀번호 암호화
                    .nickname("관리자")
                    .social(false)
                    .build();

            admin.addRole(PlayerRole.ADMIN); // 관리자 권한 추가
            playerRepository.save(admin);

            System.out.println("관리자 계정 생성 완료");
            System.out.println("이메일: " + adminEmail);
            System.out.println("초기 비밀번호: " + adminPassword);
        } else {
            System.out.println("관리자 계정이 이미 존재합니다.");
        }
    }
}
