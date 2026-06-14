package dev.salman.backend.audit.repository;

import dev.salman.backend.audit.entity.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findByUserIdOrderByTimestampDesc(UUID userId);
    List<AuditLog> findByEntityTypeAndEntityIdOrderByTimestampDesc(String entityType, UUID entityId);
}
