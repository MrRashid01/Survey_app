package com.example.surveyapp.controller;

import com.example.surveyapp.model.User;
import com.example.surveyapp.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173") // Allow React app
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ========== SIGNUP ==========
    @PostMapping("/signup")
    public Map<String, Object> signup(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        // Check if email already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            response.put("status", "error");
            response.put("message", "Email already registered");
            return response;
        }

        userRepository.save(user);
        response.put("status", "ok");
        response.put("message", "User registered successfully");
        return response;
    }

    // ========== LOGIN ==========
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User loginUser) {
        Map<String, Object> response = new HashMap<>();

        return userRepository.findByEmail(loginUser.getEmail())
                .filter(u -> u.getPassword().equals(loginUser.getPassword()))
                .map(u -> {
                    response.put("status", "ok");
                    response.put("userId", u.getId());
                    response.put("name", u.getName());
                    return response;
                })
                .orElseGet(() -> {
                    response.put("status", "error");
                    response.put("message", "Invalid credentials");
                    return response;
                });
    }
}
