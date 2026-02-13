package com.example.reviewmanagement.repository;

import com.example.reviewmanagement.model.Review;
import com.example.reviewmanagement.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUser(User user);
    List<Review> findByStatus(String status);
    List<Review> findByStatusOrderByCreatedAtDesc(String status);
    
    @Query("SELECT r FROM Review r WHERE r.user.id = :userId")
    List<Review> findByUserId(@Param("userId") Long userId);
    
    // ✅ ADD THIS METHOD
    @Query("SELECT COUNT(r) FROM Review r WHERE r.status = :status")
    Long countByStatus(@Param("status") String status);
}