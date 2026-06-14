package dev.salman.backend.messaging.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditEvent implements Serializable {
    private UUID userId;
    private String action;
    private String entityType;
    private UUID entityId;
    private String clientIp;
    
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
