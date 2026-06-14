package dev.salman.backend.features.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicalRecordRequest {
    private List<String> conditions;
    private List<String> allergies;
    private Map<String, Object> vitals;
}
