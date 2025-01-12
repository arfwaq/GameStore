package com.gamestore_back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
public class GamestoreBackApplication {

    public static void main(String[] args) {
        SpringApplication.run(GamestoreBackApplication.class, args);
    }

}
