package com.example.surveyapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateSurveyDTO {
    private String title;
    private Long createdBy;          // userId (creator)
    private List<String> questions;  // list of questions
}
