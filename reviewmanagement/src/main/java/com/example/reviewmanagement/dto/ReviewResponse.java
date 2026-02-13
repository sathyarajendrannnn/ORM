package com.example.reviewmanagement.dto;

import com.example.reviewmanagement.model.Review;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ReviewResponse {
    private Long id;
    private String title;
    private String content;
    private Integer rating;
    private String status;
    private String productService;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String authorName;
    private Long userId;
    private Integer fakeReviewScore;
    private Boolean isSuspectedFake;
    private String riskLevel;

    public static ReviewResponse fromReview(Review review, String riskLevel) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setTitle(review.getTitle());
        response.setContent(review.getContent());
        response.setRating(review.getRating());
        response.setStatus(review.getStatus());
        response.setProductService(review.getProductService());
        response.setCreatedAt(review.getCreatedAt());
        response.setUpdatedAt(review.getUpdatedAt());
        response.setAuthorName(review.getUser().getName());
        response.setUserId(review.getUser().getId());
        response.setFakeReviewScore(review.getFakeReviewScore());
        response.setIsSuspectedFake(review.getIsSuspectedFake());
        response.setRiskLevel(riskLevel);
        return response;
    }
}