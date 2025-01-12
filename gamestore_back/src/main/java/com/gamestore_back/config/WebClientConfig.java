package com.gamestore_back.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Configuration // 이 클래스가 Spring 설정 클래스임을 명시
public class WebClientConfig {

    @Value("${steam.api.key}") // application.properties에서 키 값을 주입받음
    private String steamApiKey;

    @Bean
    public WebClient steamApiClient() {
        return WebClient.builder()
                .baseUrl("https://api.steampowered.com") // Steam API의 기본 URL
                .defaultUriVariables(Map.of("key", steamApiKey)) // 기본 URL 변수에 API 키 추가
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024 * 1024)) // 100MB
                        .build())
                .build();
    }

    @Bean
    public WebClient storeApiClient() {
        return WebClient.builder()
                .baseUrl("https://store.steampowered.com") // Steam Store API의 기본 URL
                .defaultUriVariables(Map.of("key", steamApiKey)) // 기본 URL 변수에 API 키 추가
                .exchangeStrategies(ExchangeStrategies.builder()
                        .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(10 * 1024 * 1024 * 1024)) // 100MB
                        .build())
                .build();
    }
}
