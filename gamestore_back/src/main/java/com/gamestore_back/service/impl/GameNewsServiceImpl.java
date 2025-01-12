package com.gamestore_back.service.impl;

import com.gamestore_back.domain.GameNews;
import com.gamestore_back.repository.CommentRepository;
import com.gamestore_back.repository.GameNewsRepository;
import com.gamestore_back.service.GameNewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameNewsServiceImpl implements GameNewsService {

    @Autowired
    private GameNewsRepository gameNewsRepository;

    @Autowired
    private CommentRepository commentRepository;

    @Override
    public GameNews getNewsById(Long id) {
        return gameNewsRepository.findById(id).orElse(null);
    }

    @Override
    public List<GameNews> fetchAndSaveNews(List<String> appIds, int page, int pageSize) {
        // Placeholder for news fetching logic
        return null;
    }

    @Override
    public Page<GameNews> getNewsListWithCommentCount(PageRequest pageRequest) {
        Page<GameNews> newsPage = gameNewsRepository.findAll(pageRequest);
        newsPage.forEach(news -> {
            // Update comment count dynamically
            Long commentCount = commentRepository.countByNewsId(news.getId());
            news.setCommentCount(commentCount.intValue()); // Update in memory (not persisted)
        });
        return newsPage;
    }

    @Override
    public Page<GameNews> getNewsListBySortCriteria(String sortBy, PageRequest pageRequest) {
        switch (sortBy) {
            case "createdAt":
                return gameNewsRepository.findAllByOrderByCreatedAtDesc(pageRequest);
            case "recommends":
                return gameNewsRepository.findAllByOrderByRecommendsDesc(pageRequest);
            case "downvotes":
                return gameNewsRepository.findAllByOrderByDownvotesDesc(pageRequest);
            case "commentCount":
                return gameNewsRepository.findAllByOrderByCommentCountDesc(pageRequest);
            default:
                throw new IllegalArgumentException("Invalid sort criteria: " + sortBy);
        }
    }

    @Override
    public void addRecommend(Long id) {
        GameNews news = gameNewsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("News not found with ID: " + id));
        news.setRecommends(news.getRecommends() + 1);
        gameNewsRepository.save(news);
    }

    @Override
    public void addDownvote(Long id) {
        GameNews news = gameNewsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("News not found with ID: " + id));
        news.setDownvotes(news.getDownvotes() + 1);
        gameNewsRepository.save(news);
    }
}
