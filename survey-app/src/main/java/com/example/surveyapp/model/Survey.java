package com.example.surveyapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Survey {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private Long createdBy; // ID of the user who created the survey

    @ElementCollection
    private List<String> questions; // Simple list of questions
}
