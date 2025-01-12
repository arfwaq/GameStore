package com.gamestore_back.service.impl;

import com.gamestore_back.dto.SteamAppList;
import com.gamestore_back.dto.SteamGameDTO;
import com.gamestore_back.service.SteamGameService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class SteamGameServiceImpl implements SteamGameService {

    private static final Logger logger = LoggerFactory.getLogger(SteamGameServiceImpl.class);
    private static final int DEFAULT_CACHE_DURATION = 3600; // 1 hour in seconds
    private static final int MAX_RETRIES = 3;
    private static final int RETRY_DELAY = 1000; // 1 second

    @Value("${steam.apps.api.url:https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid={appId}&count=100&maxlength=10000&format=json/}")
    private String apiUrl;

    @Value("${steam.api.key:728C9A2CD836064161B96BC35DDBA19A}") // 환경 변수로 API 키 불러오기
    private String apiKey;

    private final RestTemplate restTemplate;
    private List<String> cachedAppIds;
    private long lastCacheUpdate;

    public SteamGameServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.cachedAppIds = Collections.emptyList();
        this.lastCacheUpdate = 0;
    }

    @Override
    public List<String> fetchTop100GameAppIds() {
        if (shouldRefreshCache()) {
            refreshCache();
        }
        return cachedAppIds;
    }

    private boolean shouldRefreshCache() {
        long currentTime = System.currentTimeMillis();
        return cachedAppIds.isEmpty() ||
                TimeUnit.MILLISECONDS.toSeconds(currentTime - lastCacheUpdate) > DEFAULT_CACHE_DURATION;
    }

    private void refreshCache() {
        for (int attempt = 1; attempt <= MAX_RETRIES; attempt++) {
            try {
                fetchAndUpdateCache();
                return;
            } catch (RestClientException e) {
                handleRetry(attempt, e);
            }
        }
        logger.error("Failed to fetch Steam apps after {} attempts", MAX_RETRIES);
    }

    private void fetchAndUpdateCache() {
        String fullUrl = String.format("%s?key=%s", apiUrl, apiKey); // API 키 포함
        SteamAppList response = restTemplate.getForObject(fullUrl, SteamAppList.class);

        if (response != null && response.getApplist() != null) {
            cachedAppIds = response.getApplist().getApps()
                    .stream()
                    .filter(this::isValidGame)
                    .map(SteamGameDTO::getAppid)
                    .map(String::valueOf)
                    .limit(100)
                    .collect(Collectors.toList());

            lastCacheUpdate = System.currentTimeMillis();
            logger.info("Successfully cached {} game app IDs", cachedAppIds.size());
        } else {
            logger.warn("Received null or empty response from Steam API");
        }
    }

    private boolean isValidGame(SteamGameDTO game) {
        // Add validation logic here if needed
        return true;
    }

    private void handleRetry(int attempt, Exception e) {
        if (attempt < MAX_RETRIES) {
            logger.warn("Attempt {} failed, retrying in {} ms...", attempt, RETRY_DELAY);
            try {
                Thread.sleep(RETRY_DELAY);
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                logger.error("Retry interrupted", ie);
            }
        } else {
            logger.error("Final attempt failed", e);
        }
    }
}
