package com.example.surveyapp.repository;

import com.example.surveyapp.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    // Find a user by email (for login)
    Optional<User> findByEmail(String email);
}
