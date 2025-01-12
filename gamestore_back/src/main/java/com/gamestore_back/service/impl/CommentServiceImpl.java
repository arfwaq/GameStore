package com.gamestore_back.service.impl;

import com.gamestore_back.domain.Comment;
import com.gamestore_back.repository.CommentRepository;
import com.gamestore_back.repository.GameNewsRepository;
import com.gamestore_back.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private GameNewsRepository gameNewsRepository;

    @Override
    @Transactional
    public Comment createComment(Long newsId, String username, String content) {
        Comment comment = new Comment();
        comment.setNewsId(newsId);
        comment.setUsername(username);
        comment.setContent(content);

        // Save the comment
        Comment savedComment = commentRepository.save(comment);

        // Update commentCount in GameNews
        gameNewsRepository.findById(newsId).ifPresent(news -> {
            Long currentCount = commentRepository.countByNewsId(newsId);
            news.setCommentCount(currentCount.intValue());
            gameNewsRepository.save(news);
        });

        return savedComment;
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        commentRepository.findById(commentId).ifPresent(comment -> {
            Long newsId = comment.getNewsId();

            // Delete the comment
            commentRepository.deleteById(commentId);

            // Update commentCount in GameNews
            gameNewsRepository.findById(newsId).ifPresent(news -> {
                Long currentCount = commentRepository.countByNewsId(newsId);
                news.setCommentCount(currentCount.intValue());
                gameNewsRepository.save(news);
            });
        });
    }

    @Override
    public Page<Comment> getCommentsByNewsId(Long newsId, int page, int size) {
        return commentRepository.findByNewsIdOrderByCreatedAtDesc(newsId, PageRequest.of(page, size));
    }

    @Override
    @Transactional
    public void addLike(Long commentId) {
        commentRepository.findById(commentId).ifPresent(comment -> {
            comment.setLikes(comment.getLikes() + 1);
            commentRepository.save(comment);
        });
    }

    @Override
    @Transactional
    public void addDislike(Long commentId) {
        commentRepository.findById(commentId).ifPresent(comment -> {
            comment.setDislikes(comment.getDislikes() + 1);
            commentRepository.save(comment);
        });
    }

    @Override
    @Transactional
    public void updateComment(Long commentId, String updatedContent) {
        commentRepository.findById(commentId).ifPresent(comment -> {
            comment.setContent(updatedContent);
            commentRepository.save(comment);
        });
    }

    @Override
    public Long getCommentCountByNewsId(Long newsId) {
        return commentRepository.countByNewsId(newsId);
    }

    // Reset all comment counts in GameNews
    @Override
    @Transactional
    public void resetCommentCounts() {
        gameNewsRepository.findAll().forEach(news -> {
            Long currentCount = commentRepository.countByNewsId(news.getId());
            news.setCommentCount(currentCount.intValue());
            gameNewsRepository.save(news);
        });
    }
}
