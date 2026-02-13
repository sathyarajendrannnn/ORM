package com.example.reviewmanagement.controller;

import com.example.reviewmanagement.model.Role;
import com.example.reviewmanagement.model.User;
import com.example.reviewmanagement.model.Review;
import com.example.reviewmanagement.service.ReviewService;
import com.example.reviewmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final ReviewService reviewService;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @GetMapping("/test-cors")
    public ResponseEntity<?> testCors() {
        return ResponseEntity.ok("CORS origins: " + allowedOrigins);
    }

    private User getCurrentUser() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext()
                    .getAuthentication().getPrincipal();
            if (userDetails == null) {
                System.err.println("❌ No user details found in SecurityContext");
                return null;
            }
            return userService.findByEmail(userDetails.getUsername());
        } catch (Exception e) {
            System.err.println("❌ Error getting current user: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        try {
            System.out.println("=".repeat(50));
            System.out.println("📡 /api/admin/dashboard endpoint called");
            
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(401).body("No authenticated user found");
            }
            
            if (!Role.ADMIN.equals(currentUser.getRole())) {
                return ResponseEntity.status(403).body("Access denied. Admin privileges required.");
            }
            
            Map<String, Object> stats = new HashMap<>();
            
            try {
                long totalUsers = userService.getAllUsers().size();
                stats.put("totalUsers", totalUsers);
                System.out.println("✅ Total users: " + totalUsers);
            } catch (Exception e) {
                System.err.println("❌ Error fetching users count: " + e.getMessage());
                stats.put("totalUsers", 0);
            }
            
            try {
                long pendingReviews = reviewService.getPendingCount();
                stats.put("pendingReviews", pendingReviews);
                System.out.println("✅ Pending reviews: " + pendingReviews);
            } catch (Exception e) {
                System.err.println("❌ Error fetching pending reviews: " + e.getMessage());
                stats.put("pendingReviews", 0);
            }
            
            try {
                long approvedReviews = reviewService.getApprovedCount();
                stats.put("approvedReviews", approvedReviews);
                System.out.println("✅ Approved reviews: " + approvedReviews);
            } catch (Exception e) {
                System.err.println("❌ Error fetching approved reviews: " + e.getMessage());
                stats.put("approvedReviews", 0);
            }
            
            try {
                long totalReviews = reviewService.getAllReviews().size();
                stats.put("totalReviews", totalReviews);
                System.out.println("✅ Total reviews: " + totalReviews);
            } catch (Exception e) {
                System.err.println("❌ Error fetching total reviews: " + e.getMessage());
                stats.put("totalReviews", 0);
            }
            
            System.out.println("📤 Returning stats: " + stats);
            System.out.println("=".repeat(50));
            
            return ResponseEntity.ok(stats);
            
        } catch (Exception e) {
            System.err.println("❌ Error in /api/admin/dashboard: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, Object> defaultStats = new HashMap<>();
            defaultStats.put("totalUsers", 0);
            defaultStats.put("pendingReviews", 0);
            defaultStats.put("approvedReviews", 0);
            defaultStats.put("totalReviews", 0);
            return ResponseEntity.ok(defaultStats);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            System.out.println("=".repeat(50));
            System.out.println("📡 /api/admin/users endpoint called");
            
            User currentUser = getCurrentUser();
            if (currentUser == null) {
                return ResponseEntity.status(401).body("No authenticated user found");
            }
            
            if (!Role.ADMIN.equals(currentUser.getRole())) {
                return ResponseEntity.status(403).body("Access denied. Admin privileges required.");
            }
            
            List<User> users = userService.getAllUsers();
            System.out.println("✅ Found " + users.size() + " users in database");
            
            List<Map<String, Object>> userList = users.stream().map(user -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", user.getId());
                map.put("name", user.getName());
                map.put("email", user.getEmail());
                map.put("role", user.getRole() != null ? user.getRole().toString() : "USER");
                map.put("createdAt", user.getCreatedAt());
                return map;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(userList);
            
        } catch (Exception e) {
            System.err.println("❌ Error in /api/admin/users: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/reviews/pending")
    public ResponseEntity<?> getPendingReviews() {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null || !Role.ADMIN.equals(currentUser.getRole())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            List<Review> pendingReviews = reviewService.getPendingReviews();
            return ResponseEntity.ok(pendingReviews);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/reviews/{id}/status")
    public ResponseEntity<?> moderateReview(@PathVariable Long id, @RequestParam String status) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null || !Role.ADMIN.equals(currentUser.getRole())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            Review moderated = reviewService.moderateReview(id, status, currentUser);
            return ResponseEntity.ok(moderated);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to moderate review: " + e.getMessage());
        }
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestParam Role role) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null || !Role.ADMIN.equals(currentUser.getRole())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            if (currentUser.getId().equals(id)) {
                return ResponseEntity.badRequest().body("Cannot change your own role");
            }
            
            User updatedUser = userService.updateUserRole(id, role);
            
            Map<String, Object> userMap = new HashMap<>();
            userMap.put("id", updatedUser.getId());
            userMap.put("name", updatedUser.getName());
            userMap.put("email", updatedUser.getEmail());
            userMap.put("role", updatedUser.getRole().toString());
            userMap.put("createdAt", updatedUser.getCreatedAt());
            
            return ResponseEntity.ok(userMap);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to update user role: " + e.getMessage());
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            User currentUser = getCurrentUser();
            if (currentUser == null || !Role.ADMIN.equals(currentUser.getRole())) {
                return ResponseEntity.status(403).body("Access denied");
            }
            
            if (currentUser.getId().equals(id)) {
                return ResponseEntity.badRequest().body("Cannot delete your own account");
            }
            
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Failed to delete user: " + e.getMessage());
        }
    }
    
    @GetMapping("/test")
    public ResponseEntity<?> test() {
        return ResponseEntity.ok("Admin API is working!");
    }
}