package dev.salman.backend.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.salman.backend.config.RabbitMQConfig;
import dev.salman.backend.audit.entity.AuditLog;
import dev.salman.backend.audit.repository.AuditLogRepository;
import dev.salman.backend.messaging.dto.AuditEvent;
import dev.salman.backend.messaging.dto.NotificationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Service;

@Service
public class MessageConsumer {

    private static final Logger logger = LoggerFactory.getLogger(MessageConsumer.class);
    
    // Dedicated audit logger mapped to logs/audit.log in logback-spring.xml
    private static final Logger auditLogger = LoggerFactory.getLogger("dev.salman.backend.audit");

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public MessageConsumer(AuditLogRepository auditLogRepository, ObjectMapper objectMapper) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = RabbitMQConfig.AUDIT_QUEUE)
    public void consumeAuditEvent(AuditEvent event) {
        logger.debug("Received audit event from RabbitMQ: {}", event);
        try {
            // 1. Save to PostgreSQL database
            AuditLog auditLog = AuditLog.builder()
                    .userId(event.getUserId())
                    .action(event.getAction())
                    .entityType(event.getEntityType())
                    .entityId(event.getEntityId())
                    .clientIp(event.getClientIp())
                    .timestamp(event.getTimestamp())
                    .build();
            auditLogRepository.save(auditLog);

            // 2. Format as JSON string and append to logs/audit.log via logback-spring.xml configuration
            String jsonMessage = objectMapper.writeValueAsString(event);
            auditLogger.info(jsonMessage);

        } catch (Exception e) {
            logger.error("Failed to process audit log event", e);
        }
    }

    @RabbitListener(queues = RabbitMQConfig.NOTIFICATION_QUEUE)
    public void consumeNotificationEvent(NotificationEvent event) {
        logger.info("Received Notification Event: Sending {} notification to patient {}: {}", 
                event.getChannel(), event.getPatientId(), event.getMessage());
        // Simulating actual SMS/Email delivery integrations
    }
}
