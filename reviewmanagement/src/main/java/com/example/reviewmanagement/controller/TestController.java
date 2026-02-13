package com.example.reviewmanagement.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/public")
    public Map<String, String> publicEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ ORMS Backend is running!");
        response.put("status", "OK");
        response.put("timestamp", new java.util.Date().toString());
        return response;
    }

    @GetMapping("/private")
    public Map<String, String> privateEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "✅ You are authenticated!");
        response.put("status", "OK");
        return response;
    }
}