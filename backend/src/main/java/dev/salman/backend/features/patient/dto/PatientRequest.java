package dev.salman.backend.features.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PatientRequest {
    private String name;
    private LocalDate dateOfBirth;
    private String gender;
    private String ssn; // Full SSN, will be masked before saving
    private String phone;
    private String email;
    private String bloodType;
    private String emergencyContactName;
    private String emergencyContactPhone;
}
