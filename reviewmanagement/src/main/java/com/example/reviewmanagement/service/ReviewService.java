package com.example.reviewmanagement.service;

import com.example.reviewmanagement.model.Review;
import com.example.reviewmanagement.model.User;
import com.example.reviewmanagement.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final FakeReviewDetectionService fakeReviewDetectionService;
    
    public Review createReview(Review review, User user) {
        review.setUser(user);
        review = fakeReviewDetectionService.analyzeReview(review);
        review.setStatus("PENDING");
        return reviewRepository.save(review);
    }
    
    public List<Review> getUserReviews(User user) {
        return reviewRepository.findByUser(user);
    }
    
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }
    
    public List<Review> getPendingReviews() {
        return reviewRepository.findByStatusOrderByCreatedAtDesc("PENDING");
    }
    
    public List<Review> getApprovedReviews() {
        return reviewRepository.findByStatusOrderByCreatedAtDesc("APPROVED");
    }
    
    public Review updateReview(Long id, Review reviewDetails, User user) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only edit your own reviews");
        }
        
        review.setTitle(reviewDetails.getTitle());
        review.setContent(reviewDetails.getContent());
        review.setRating(reviewDetails.getRating());
        review.setProductService(reviewDetails.getProductService());
        review.setStatus("PENDING");
        review = fakeReviewDetectionService.analyzeReview(review);
        
        return reviewRepository.save(review);
    }
    
    public void deleteReview(Long id, User user) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        if (!review.getUser().getId().equals(user.getId()) && 
            !user.getRole().toString().equals("ADMIN")) {
            throw new RuntimeException("You can only delete your own reviews");
        }
        
        reviewRepository.delete(review);
    }
    
    public Review moderateReview(Long id, String status, User admin) {
        if (!admin.getRole().toString().equals("ADMIN")) {
            throw new RuntimeException("Only admins can moderate reviews");
        }
        
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setStatus(status);
        return reviewRepository.save(review);
    }
    
    // ✅ ADD THESE METHODS
    public Long getPendingCount() {
        try {
            return reviewRepository.countByStatus("PENDING");
        } catch (Exception e) {
            System.err.println("❌ Error counting pending reviews: " + e.getMessage());
            return 0L;
        }
    }
    
    public Long getApprovedCount() {
        try {
            return reviewRepository.countByStatus("APPROVED");
        } catch (Exception e) {
            System.err.println("❌ Error counting approved reviews: " + e.getMessage());
            return 0L;
        }
    }
}