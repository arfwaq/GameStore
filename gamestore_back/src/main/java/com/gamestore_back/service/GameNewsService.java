package com.gamestore_back.service;

import com.gamestore_back.domain.GameNews;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface GameNewsService {
    GameNews getNewsById(Long id);

    List<GameNews> fetchAndSaveNews(List<String> appIds, int page, int pageSize);

    Page<GameNews> getNewsListWithCommentCount(PageRequest pageRequest);

    Page<GameNews> getNewsListBySortCriteria(String sortBy, PageRequest pageRequest);

    void addRecommend(Long id);

    void addDownvote(Long id);
}