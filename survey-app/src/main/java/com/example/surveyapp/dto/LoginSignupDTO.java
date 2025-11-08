package com.example.surveyapp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginSignupDTO {
    private String name;     // Used only during signup
    private String email;
    private String password;
}
