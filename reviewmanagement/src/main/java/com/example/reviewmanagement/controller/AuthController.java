package com.example.reviewmanagement.controller;

import com.example.reviewmanagement.dto.AuthResponse;
import com.example.reviewmanagement.dto.LoginRequest;
import com.example.reviewmanagement.dto.RegisterRequest;
import com.example.reviewmanagement.model.User;
import com.example.reviewmanagement.service.JwtService;
import com.example.reviewmanagement.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            User user = userService.registerUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getName()
            );

            String token = jwtService.generateToken(user.getEmail());

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getName(),
                    user.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            User user = userService.findByEmail(request.getEmail());
            String token = jwtService.generateToken(user.getEmail());

            return ResponseEntity.ok(new AuthResponse(
                    token,
                    user.getEmail(),
                    user.getName(),
                    user.getRole()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid email or password");
        }
    }
}