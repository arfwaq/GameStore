package com.gamestore_back.service.impl;

import com.gamestore_back.dto.SteamNewsDTO;
import com.gamestore_back.service.SteamNewsService;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SteamNewsServiceImpl implements SteamNewsService {

    private static final Logger logger = LoggerFactory.getLogger(SteamNewsServiceImpl.class);

    @Value("${steam.api.key}")
    private String apiKey;

    private static final String NEWS_API_URL = "https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/";
    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public List<SteamNewsDTO.NewsItem> fetchNews(String appId) {
        String url = String.format("%s?appid=%s&count=10&maxlength=10000&key=%s",
                NEWS_API_URL, appId, apiKey);

        logger.info("Fetching news (excluding images) from URL: {}", url);

        try {
            SteamNewsDTO response = restTemplate.getForObject(url, SteamNewsDTO.class);
            logger.info("API response: {}", response);

            if (response != null && response.getAppnews() != null && response.getAppnews().getNewsitems() != null) {
                return Arrays.stream(response.getAppnews().getNewsitems())
                        .map(item -> {
                            if (item.getContents() != null) {
                                // 이미지 태그나 관련된 URL을 제거
                                String cleanedContent = item.getContents()
                                        .replaceAll("\\{STEAM_CLAN_IMAGE}.*?\\s", "")
                                        .replaceAll("https?://\\S+\\s?", ""); // URL 제거
                                item.setContents(cleanedContent);
                            }
                            item.setPublishDate(Instant.ofEpochSecond(item.getDate()));
                            return item;
                        })
                        .collect(Collectors.toList());
            } else {
                logger.warn("Received null or empty response from Steam API");
            }
        } catch (Exception e) {
            logger.error("Error fetching news for App ID {}: {}", appId, e.getMessage(), e);
        }
        return Collections.emptyList();
    }


    @Override
    public List<SteamNewsDTO.NewsItem> fetchTop100LatestNews(List<String> appIds) {
        return appIds.stream()
                .flatMap(appId -> fetchNews(appId).stream())
                .sorted((a, b) -> b.getDate().compareTo(a.getDate())) // 최신순 정렬
                .limit(100) // 상위 100개 뉴스 반환
                .collect(Collectors.toList());
    }

    private String fetchContentFromUrl(String url) {
        try {
            Document document = Jsoup.connect(url).get();
            return document.body().text();
        } catch (Exception e) {
            logger.error("Failed to fetch content from URL: {}", url, e);
            return "Full content unavailable.";
        }
    }
}
