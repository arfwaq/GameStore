package com.gamestore_back.controller;

import com.gamestore_back.domain.GameNews;
import com.gamestore_back.dto.SteamNewsDTO;
import com.gamestore_back.service.GameNewsService;
import com.gamestore_back.service.SteamNewsService;
import com.gamestore_back.service.impl.CommentServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/news")
@CrossOrigin(origins = "http://localhost:3000")
public class GameNewsController {

    @Autowired
    private GameNewsService gameNewsService;

    @Autowired
    private SteamNewsService steamNewsService;

    @Autowired
    private CommentServiceImpl commentServiceImpl;

    @GetMapping("/{id}")
    public ResponseEntity<GameNews> getNewsById(@PathVariable Long id) {
        GameNews news = gameNewsService.getNewsById(id);
        if (news != null) {
            return ResponseEntity.ok(news);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/fetch")
    public ResponseEntity<?> fetchNews(@RequestBody Map<String, Object> request) {
        try {
            List<String> appIds = (List<String>) request.get("appIds");
            int page = (int) request.get("page");
            int pageSize = (int) request.get("pageSize");

            List<GameNews> news = gameNewsService.fetchAndSaveNews(appIds, page, pageSize);
            return ResponseEntity.ok(news);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching news");
        }
    }

    @GetMapping("/latest/top100")
    public ResponseEntity<?> fetchTop100LatestNews() {
        List<String> appIds = Arrays.asList("440", "570", "730", "236850", "292030");

        try {
            List<SteamNewsDTO.NewsItem> latestNews = steamNewsService.fetchTop100LatestNews(appIds);
            return ResponseEntity.ok(latestNews);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching top 100 latest news: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/recommend")
    public ResponseEntity<String> addRecommend(@PathVariable Long id) {
        try {
            gameNewsService.addRecommend(id);
            return ResponseEntity.ok("Recommendation added successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add recommendation: " + e.getMessage());
        }
    }

    @PatchMapping("/{id}/downvote")
    public ResponseEntity<String> addDownvote(@PathVariable Long id) {
        try {
            gameNewsService.addDownvote(id);
            return ResponseEntity.ok("Downvote added successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add downvote: " + e.getMessage());
        }
    }
    // 뉴스 페이지네이션 및 정렬
    @GetMapping("/list")
    public ResponseEntity<?> getNewsList(
            @RequestParam(defaultValue = "publishDate") String sortBy,
            @RequestParam(defaultValue = "desc") String order,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            PageRequest pageRequest = PageRequest.of(page, size,
                    order.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending());

            Page<GameNews> newsPage = gameNewsService.getNewsListWithCommentCount(pageRequest);
            return ResponseEntity.ok(newsPage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching news list: " + e.getMessage());
        }
    }

    // Reset all comment counts in GameNews
    @PostMapping("/reset-comment-counts")
    public ResponseEntity<?> resetCommentCounts() {
        try {
            commentServiceImpl.resetCommentCounts();
            return ResponseEntity.ok("Comment counts reset successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error resetting comment counts: " + e.getMessage());
        }
    }
}
