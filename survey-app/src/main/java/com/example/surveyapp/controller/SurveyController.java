package com.example.surveyapp.controller;

import com.example.surveyapp.model.*;
import com.example.surveyapp.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/surveys")
public class SurveyController {

    private final SurveyRepository surveyRepo;
    private final ResponseRepository responseRepo;

    public SurveyController(SurveyRepository surveyRepo, ResponseRepository responseRepo) {
        this.surveyRepo = surveyRepo;
        this.responseRepo = responseRepo;
    }

    // ========== CREATE SURVEY ==========
    @PostMapping
    public Survey createSurvey(@RequestBody Survey survey) {
        return surveyRepo.save(survey);
    }

    // ========== GET ALL SURVEYS ==========
    @GetMapping
    public List<Survey> getAllSurveys() {
        return surveyRepo.findAll();
    }

    // ✅ NEW — GET SURVEYS CREATED BY A SPECIFIC USER
    @GetMapping("/user/{userId}")
    public List<Survey> getSurveysByUser(@PathVariable Long userId) {
        return surveyRepo.findByCreatedBy(userId);
    }

    // ========== GET SURVEY BY ID ==========
    @GetMapping("/{id}")
    public Optional<Survey> getSurveyById(@PathVariable Long id) {
        return surveyRepo.findById(id);
    }

    // ========== SUBMIT RESPONSE ==========
    @PostMapping("/{id}/responses")
    public Response submitResponse(@PathVariable Long id, @RequestBody Response response) {
        response.setId(null);       // ✅ Force Hibernate to treat as a new record
        response.setSurveyId(id);   // Link to the correct survey
        return responseRepo.save(response);
    }

    // ========== GET ALL RESPONSES FOR A SURVEY ==========
    @GetMapping("/{id}/responses")
    public List<Response> getResponsesForSurvey(@PathVariable Long id) {
        return responseRepo.findBySurveyId(id);
    }

    // ========== ANALYZE SURVEY RESULTS ==========
    @GetMapping("/{id}/analysis")
    public Map<String, Object> analyzeSurvey(@PathVariable Long id) {
        Map<String, Object> result = new LinkedHashMap<>();

        Survey survey = surveyRepo.findById(id).orElse(null);
        if (survey == null) {
            result.put("error", "Survey not found");
            return result;
        }

        List<Response> responses = responseRepo.findBySurveyId(id);
        result.put("surveyTitle", survey.getTitle());
        result.put("totalResponses", responses.size());

        List<Map<String, Object>> analysis = new ArrayList<>();

        // Loop through each question in the survey
        for (int i = 0; i < survey.getQuestions().size(); i++) {
            final int index = i;
            String question = survey.getQuestions().get(index);

            // Count answers for each question
            Map<String, Long> counts = responses.stream()
                    .map(Response::getAnswers)
                    .filter(ans -> ans.size() > index)
                    .collect(Collectors.groupingBy(
                            ans -> ans.get(index),
                            Collectors.counting()
                    ));

            // Calculate average (if numeric responses)
            double avg = responses.stream()
                    .map(Response::getAnswers)
                    .filter(ans -> ans.size() > index && ans.get(index).matches("\\d+"))
                    .mapToInt(ans -> Integer.parseInt(ans.get(index)))
                    .average()
                    .orElse(0.0);

            // Build result per question
            Map<String, Object> qResult = new LinkedHashMap<>();
            qResult.put("question", question);
            qResult.put("counts", counts);
            if (avg > 0) qResult.put("average", avg);

            analysis.add(qResult);
        }

        result.put("analysis", analysis);
        return result;
    }
}
