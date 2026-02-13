package com.example.reviewmanagement.controller;

import com.example.reviewmanagement.dto.ReviewResponse;
import com.example.reviewmanagement.model.Review;
import com.example.reviewmanagement.model.User;
import com.example.reviewmanagement.service.FakeReviewDetectionService;
import com.example.reviewmanagement.service.ReviewService;
import com.example.reviewmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3003", "http://localhost:5173"}, allowCredentials = "true")
@RequiredArgsConstructor
public class ReviewController {
    
    private final ReviewService reviewService;
    private final UserService userService;
    private final FakeReviewDetectionService fakeDetectionService;
    
    private User getCurrentUser() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();
            return userService.findByEmail(userDetails.getUsername());
        } catch (Exception e) {
            return null;
        }
    }
    
    @PostMapping
    public ResponseEntity<?> createReview(@RequestBody ReviewRequest request) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            
            Review review = new Review();
            review.setTitle(request.getTitle());
            review.setContent(request.getContent());
            review.setRating(request.getRating());
            review.setProductService(request.getProductService());
            
            Review savedReview = reviewService.createReview(review, currentUser);
            
            ReviewResponse response = ReviewResponse.fromReview(savedReview, null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/my")
    public ResponseEntity<?> getMyReviews() {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            
            List<Review> reviews = reviewService.getUserReviews(currentUser);
            
            List<ReviewResponse> responses = reviews.stream()
                .map(review -> {
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
                    return response;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // ✅ PUBLIC ENDPOINT - NO AUTHENTICATION REQUIRED
    @GetMapping("/approved")
    public ResponseEntity<?> getApprovedReviews() {
        try {
            System.out.println("📡 /api/reviews/approved endpoint called - PUBLIC ACCESS");
            
            List<Review> reviews = reviewService.getApprovedReviews();
            System.out.println("✅ Found " + reviews.size() + " approved reviews");
            
            // Filter out suspected fake reviews for public view
            List<ReviewResponse> responses = reviews.stream()
                .filter(review -> !Boolean.TRUE.equals(review.getIsSuspectedFake()))
                .map(review -> {
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
                    // NO fake review data for public
                    return response;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            System.err.println("❌ Error fetching approved reviews: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error fetching reviews: " + e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateReview(@PathVariable Long id, @RequestBody ReviewRequest request) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            
            Review review = new Review();
            review.setTitle(request.getTitle());
            review.setContent(request.getContent());
            review.setRating(request.getRating());
            review.setProductService(request.getProductService());
            
            Review updatedReview = reviewService.updateReview(id, review, currentUser);
            
            ReviewResponse response = ReviewResponse.fromReview(updatedReview, null);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(401).body("User not authenticated");
            }
            
            reviewService.deleteReview(id, currentUser);
            return ResponseEntity.ok("Review deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}