package com.example.reviewmanagement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ReviewManagementApplication {
	public static void main(String[] args) {
		SpringApplication.run(ReviewManagementApplication.class, args);
		System.out.println("\n🚀 ORMS Backend Started Successfully!");
		System.out.println("📝 Test endpoints:");
		System.out.println("   GET  http://localhost:8080/api/test/public");
		System.out.println("   POST http://localhost:8080/api/auth/register");
		System.out.println("   POST http://localhost:8080/api/auth/login");
		System.out.println("\n👤 Default Admin: admin@orms.com / admin123\n");
	}
}