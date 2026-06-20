package dev.salman.backend.features.notification.service;

import dev.salman.backend.features.notification.entity.Notification;
import java.util.UUID;

public record NotificationCreatedEvent(UUID userId, Notification notification) {
}
