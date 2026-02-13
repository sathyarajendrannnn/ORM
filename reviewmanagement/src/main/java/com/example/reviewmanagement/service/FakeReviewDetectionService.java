package com.example.reviewmanagement.service;

import com.example.reviewmanagement.ml.FakeReviewKeywords;
import com.example.reviewmanagement.model.Review;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FakeReviewDetectionService {

    private final FakeReviewKeywords fakeReviewKeywords;

    public Review analyzeReview(Review review) {
        int fakeScore = fakeReviewKeywords.calculateFakeScore(review.getContent());
        boolean isSuspectedFake = fakeReviewKeywords.isSuspectedFake(fakeScore);

        review.setFakeReviewScore(fakeScore);
        review.setIsSuspectedFake(isSuspectedFake);

        return review;
    }

    public String getRiskLevel(int score) {
        if (score < 30) return "LOW";
        if (score < 60) return "MEDIUM";
        return "HIGH";
    }
}