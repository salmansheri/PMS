package dev.salman.backend.features.queue.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueueRequest {
    private UUID patientId;
    private UUID doctorId;
}
