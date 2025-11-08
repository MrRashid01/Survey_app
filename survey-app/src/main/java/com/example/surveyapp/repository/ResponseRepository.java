package com.example.surveyapp.repository;

import com.example.surveyapp.model.Response;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ResponseRepository extends JpaRepository<Response, Long> {

    // Get all responses for a specific survey
    List<Response> findBySurveyId(Long surveyId);
}
