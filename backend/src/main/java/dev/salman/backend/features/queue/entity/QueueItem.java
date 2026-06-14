package dev.salman.backend.features.queue.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "queue_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueueItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "patient_id", nullable = false)
    private UUID patientId;

    @Column(name = "doctor_id", nullable = false)
    private UUID doctorId;

    @Column(name = "token_number", nullable = false)
    private Integer tokenNumber;

    @Column(nullable = false)
    @Builder.Default
    private String status = "WAITING"; // WAITING, ACTIVE, COMPLETED

    @Column(name = "checked_in_time", nullable = false)
    @Builder.Default
    private LocalDateTime checkedInTime = LocalDateTime.now();
}
