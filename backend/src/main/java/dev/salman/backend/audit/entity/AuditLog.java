package dev.salman.backend.audit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "user_id")
    private UUID userId; // Who executed the operation

    @Column(nullable = false)
    private String action; // e.g. LOGIN, UPDATE_PATIENT, BOOK_APPOINTMENT

    @Column(name = "entity_type")
    private String entityType; // e.g. Patient, Appointment

    @Column(name = "entity_id")
    private UUID entityId;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    @Column(name = "client_ip")
    private String clientIp;
}
