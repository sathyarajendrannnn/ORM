package com.example.reviewmanagement.ml;

import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Component
public class FakeReviewKeywords {

    // Suspicious keywords often found in fake reviews
    private static final Set<String> SUSPICIOUS_KEYWORDS = new HashSet<>(Arrays.asList(
            "best product ever", "amazing", "perfect", "excellent", "wonderful",
            "fantastic", "awesome", "incredible", "superb", "outstanding",
            "terrible", "worst", "horrible", "awful", "disappointed",
            "scam", "fraud", "fake", "useless", "waste of money",
            "buy this", "recommend", "must have", "five stars", "highly recommend",
            "click here", "discount", "cheap", "deal", "offer",
            "www.", "http://", "https://", "visit", "check out",
            "money back", "guarantee", "lifetime", "unbelievable", "miracle"
    ));

    // All caps words (possible spam)
    private static final Set<String> ALL_CAPS_WORDS = new HashSet<>(Arrays.asList(
            "BEST", "AMAZING", "PERFECT", "EXCELLENT", "WONDERFUL",
            "FANTASTIC", "AWESOME", "INCREDIBLE", "SUPER", "GREAT",
            "WORST", "TERRIBLE", "HORRIBLE", "AWFUL", "SCAM",
            "FRAUD", "FAKE", "USELESS", "WASTE", "BUY",
            "MUST", "TOP", "RATED", "NUMBER 1", "BESTSELLER"
    ));

    // Short words (1-2 characters)
    private static final Set<String> SHORT_WORDS = new HashSet<>(Arrays.asList(
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
            "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "ok", "okay", "good", "bad", "nice"
    ));

    public int calculateFakeScore(String content) {
        if (content == null || content.isEmpty()) {
            return 0;
        }

        int score = 0;
        String lowerContent = content.toLowerCase();
        String upperContent = content.toUpperCase();

        // Check for suspicious keywords
        for (String keyword : SUSPICIOUS_KEYWORDS) {
            if (lowerContent.contains(keyword)) {
                score += 10;
            }
        }

        // Check for all caps words (excessive shouting)
        String[] words = content.split("\\s+");
        int allCapsCount = 0;
        for (String word : words) {
            if (word.length() > 2 && word.equals(word.toUpperCase())) {
                allCapsCount++;
            }
        }
        score += Math.min(allCapsCount * 5, 30);

        // Check for excessive exclamation marks
        int exclamationCount = content.length() - content.replace("!", "").length();
        score += Math.min(exclamationCount * 2, 20);

        // Check for repetitive content
        if (words.length > 10) {
            Set<String> uniqueWords = new HashSet<>(Arrays.asList(words));
            double repetitionRatio = 1.0 - (double) uniqueWords.size() / words.length;
            if (repetitionRatio > 0.5) {
                score += 25;
            }
        }

        // Very short reviews (suspicious)
        if (words.length < 5) {
            score += 15;
        }

        // Contains URLs
        if (lowerContent.contains("http") || lowerContent.contains("www.")) {
            score += 30;
        }

        return Math.min(score, 100);
    }

    public boolean isSuspectedFake(int score) {
        return score >= 50;
    }
}