package dev.salman.backend.features.notification.service;

import dev.salman.backend.features.notification.entity.Notification;
import dev.salman.backend.features.notification.repository.NotificationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SseNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(SseNotificationService.class);

    private final Map<UUID, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final NotificationRepository notificationRepository;

    public SseNotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public SseEmitter subscribe(UUID userId) {
        // Create emitter with 30 minutes timeout (1,800,000 ms)
        SseEmitter emitter = new SseEmitter(1_800_000L);

        emitters.put(userId, emitter);

        emitter.onCompletion(() -> {
            logger.debug("SSE connection completed for user: {}", userId);
            emitters.remove(userId);
        });

        emitter.onTimeout(() -> {
            logger.debug("SSE connection timeout for user: {}", userId);
            emitters.remove(userId);
        });

        emitter.onError((ex) -> {
            logger.debug("SSE connection error for user: {}", userId, ex);
            emitters.remove(userId);
        });

        // Send initial connection event to complete handshake
        try {
            emitter.send(SseEmitter.event().name("CONNECT").data("Connection established"));
        } catch (IOException e) {
            logger.error("Failed to send connection message to user: {}", userId, e);
            emitters.remove(userId);
        }

        return emitter;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleNotificationCreated(NotificationCreatedEvent event) {
        UUID userId = event.userId();
        Notification notification = event.notification();

        SseEmitter emitter = emitters.get(userId);
        if (emitter != null) {
            try {
                emitter.send(SseEmitter.event()
                        .name("NOTIFICATION")
                        .id(notification.getId().toString())
                        .data(notification));
                logger.debug("Pushed live notification to user: {}", userId);
            } catch (IOException e) {
                logger.warn("Failed to push SSE to user: {}. Removing dead connection.", userId);
                emitters.remove(userId);
            }
        }
    }

    // Heartbeat ping every 20 seconds to keep connection tunnels alive
    @Scheduled(fixedRate = 20000)
    public void sendHeartbeat() {
        if (emitters.isEmpty()) {
            return;
        }
        logger.debug("Broadcasting SSE heartbeat ping to {} clients", emitters.size());
        emitters.forEach((userId, emitter) -> {
            try {
                emitter.send(SseEmitter.event().comment("ping"));
            } catch (IOException e) {
                logger.warn("Removing dead SSE emitter for user: {}", userId);
                emitters.remove(userId);
            }
        });
    }
}
