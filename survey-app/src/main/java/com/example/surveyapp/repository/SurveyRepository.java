package com.example.surveyapp.repository;

import com.example.surveyapp.model.Survey;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SurveyRepository extends JpaRepository<Survey, Long> {

    // Find all surveys created by a specific user
    List<Survey> findByCreatedBy(Long userId);
}
