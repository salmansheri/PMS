package dev.salman.backend.features.notification;

import dev.salman.backend.features.notification.entity.Notification;
import dev.salman.backend.features.notification.repository.NotificationRepository;
import dev.salman.backend.features.notification.service.SseNotificationService;
import dev.salman.backend.shared.SecurityUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/notifications")
@PreAuthorize("isAuthenticated()")
public class NotificationController {

    private final SseNotificationService sseNotificationService;
    private final NotificationRepository notificationRepository;

    public NotificationController(SseNotificationService sseNotificationService,
                                  NotificationRepository notificationRepository) {
        this.sseNotificationService = sseNotificationService;
        this.notificationRepository = notificationRepository;
    }

    @GetMapping("/subscribe")
    public SseEmitter subscribe() {
        UUID userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            throw new IllegalStateException("Authentication context required for subscription");
        }
        return sseNotificationService.subscribe(userId);
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {
        UUID userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Notification> unread = notificationRepository.findByUserIdAndStatusOrderByCreatedAtDesc(userId, "UNREAD");
        return ResponseEntity.ok(unread);
    }

    @PostMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead() {
        UUID userId = SecurityUtils.getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        notificationRepository.markAllAsReadForUser(userId);
        return ResponseEntity.ok().build();
    }
}
