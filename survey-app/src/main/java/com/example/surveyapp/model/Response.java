package com.example.surveyapp.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Response {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long surveyId; // Which survey this response belongs to

    @ElementCollection
    private List<String> answers; // One answer per question
}
