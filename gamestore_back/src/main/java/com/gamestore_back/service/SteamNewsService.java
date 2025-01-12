package com.gamestore_back.service;

import com.gamestore_back.dto.SteamNewsDTO;

import java.util.List;

public interface SteamNewsService {
    List<SteamNewsDTO.NewsItem> fetchNews(String appId);
    List<SteamNewsDTO.NewsItem> fetchTop100LatestNews(List<String> appIds);
}
