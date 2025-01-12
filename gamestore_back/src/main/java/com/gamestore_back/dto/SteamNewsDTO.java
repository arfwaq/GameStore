package com.gamestore_back.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

public class SteamNewsDTO {

    private AppNews appnews;

    public AppNews getAppnews() {
        return appnews;
    }

    public void setAppnews(AppNews appnews) {
        this.appnews = appnews;
    }

    public static class AppNews {
        private NewsItem[] newsitems;

        public NewsItem[] getNewsitems() {
            return newsitems;
        }

        public void setNewsitems(NewsItem[] newsitems) {
            this.newsitems = newsitems;
        }
    }

    public static class NewsItem {
        private String gid; // Unique ID for the news item
        private String title; // News title
        private String url; // URL for the news item
        private String contents; // Contents of the news item

        @JsonProperty("date")
        private Long date; // Unix epoch time for the publish date

        private Instant publishDate; // Converted publish date

        @JsonProperty("image") // JSON key "image" mapped to this field
        private String image; // Image URL

        private String author; // Author of the news item (optional)
        private String category; // Category of the news (e.g., "Update", "Event")

        // Newly added fields for additional functionality
        private int commentCount; // Number of comments
        private int recommends; // Number of likes/recommendations
        private int downvotes; // Number of dislikes

        // Getter and Setter for gid
        public String getGid() {
            return gid;
        }

        public void setGid(String gid) {
            this.gid = gid;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getContents() {
            return contents;
        }

        public void setContents(String contents) {
            this.contents = contents;
        }

        public Long getDate() {
            return date;
        }

        public void setDate(Long date) {
            this.date = date;
        }

        public Instant getPublishDate() {
            return publishDate;
        }

        public void setPublishDate(Instant publishDate) {
            this.publishDate = publishDate;
        }

        public String getImage() {
            return image;
        }

        public void setImage(String image) {
            this.image = image;
        }

        public String getAuthor() {
            return author;
        }

        public void setAuthor(String author) {
            this.author = author;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public int getCommentCount() {
            return commentCount;
        }

        public void setCommentCount(int commentCount) {
            this.commentCount = commentCount;
        }

        public int getRecommends() {
            return recommends;
        }

        public void setRecommends(int recommends) {
            this.recommends = recommends;
        }

        public int getDownvotes() {
            return downvotes;
        }

        public void setDownvotes(int downvotes) {
            this.downvotes = downvotes;
        }

        // Helper method to check if the news has an image
        public boolean hasImage() {
            return this.image != null && !this.image.isEmpty();
        }
    }
}
