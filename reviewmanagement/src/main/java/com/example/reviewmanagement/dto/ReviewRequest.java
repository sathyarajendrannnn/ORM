package com.example.reviewmanagement.dto;

import lombok.Data;

@Data
public class ReviewRequest {
    private String title;
    private String content;
    private Integer rating;
    private String productService;
    private Boolean isAnonymous;
}