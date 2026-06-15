package dev.salman.backend.features.notification.repository;

import dev.salman.backend.features.notification.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    List<Notification> findByUserIdAndStatusOrderByCreatedAtDesc(UUID userId, String status);

    @Modifying
    @Transactional
    @Query("UPDATE Notification n SET n.status = 'READ' WHERE n.userId = :userId AND n.status = 'UNREAD'")
    void markAllAsReadForUser(@Param("userId") UUID userId);
}
