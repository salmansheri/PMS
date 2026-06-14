package dev.salman.backend.messaging;

import dev.salman.backend.config.RabbitMQConfig;
import dev.salman.backend.messaging.dto.AuditEvent;
import dev.salman.backend.messaging.dto.NotificationEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
public class MessagePublisher {

    private static final Logger logger = LoggerFactory.getLogger(MessagePublisher.class);

    private final RabbitTemplate rabbitTemplate;

    public MessagePublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publishAuditEvent(AuditEvent event) {
        logger.debug("Publishing audit event to RabbitMQ: {}", event);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.AUDIT_ROUTING_KEY,
                event
        );
    }

    public void publishNotificationEvent(NotificationEvent event) {
        logger.debug("Publishing notification event to RabbitMQ: {}", event);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE,
                RabbitMQConfig.NOTIFICATION_ROUTING_KEY,
                event
        );
    }
}
