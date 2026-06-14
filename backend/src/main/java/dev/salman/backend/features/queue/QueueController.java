package dev.salman.backend.features.queue;

import dev.salman.backend.features.auth.entity.User;
import dev.salman.backend.features.auth.repository.UserRepository;
import dev.salman.backend.features.patient.repository.PatientRepository;
import dev.salman.backend.features.queue.dto.QueueRequest;
import dev.salman.backend.features.queue.entity.QueueItem;
import dev.salman.backend.features.queue.repository.QueueItemRepository;
import dev.salman.backend.messaging.MessagePublisher;
import dev.salman.backend.messaging.dto.AuditEvent;
import dev.salman.backend.messaging.dto.NotificationEvent;
import dev.salman.backend.shared.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/queue")
public class QueueController {

    private final QueueItemRepository queueItemRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final MessagePublisher messagePublisher;

    public QueueController(QueueItemRepository queueItemRepository,
                           UserRepository userRepository,
                           PatientRepository patientRepository,
                           MessagePublisher messagePublisher) {
        this.queueItemRepository = queueItemRepository;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.messagePublisher = messagePublisher;
    }

    @PostMapping("/check-in")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @Transactional
    public ResponseEntity<QueueItem> checkIn(@RequestBody QueueRequest request) {
        // 1. Verify Patient
        if (!patientRepository.existsById(request.getPatientId())) {
            throw new EntityNotFoundException("Patient not found with ID: " + request.getPatientId());
        }

        // 2. Verify Doctor
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + request.getDoctorId()));
        if (!"ROLE_DOCTOR".equals(doctor.getRole())) {
            throw new IllegalStateException("Selected user is not a registered doctor");
        }

        // 3. Verify Patient is not already active in the queue
        queueItemRepository.findByPatientIdAndStatusIn(request.getPatientId(), Arrays.asList("WAITING", "ACTIVE"))
                .ifPresent(item -> {
                    throw new IllegalStateException("Patient is already active in the queue with token: " + item.getTokenNumber());
                });

        // 4. Generate next token number
        Integer maxToken = queueItemRepository.findMaxTokenNumber();
        Integer nextToken = (maxToken == null) ? 1 : maxToken + 1;

        // 5. Create Queue Item
        QueueItem item = QueueItem.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .tokenNumber(nextToken)
                .status("WAITING")
                .checkedInTime(LocalDateTime.now())
                .build();

        QueueItem savedItem = queueItemRepository.save(item);

        // 6. Audit & Notification Events
        messagePublisher.publishAuditEvent(AuditEvent.builder()
                .userId(SecurityUtils.getCurrentUserId())
                .action("QUEUE_CHECK_IN")
                .entityType("QueueItem")
                .entityId(savedItem.getId())
                .clientIp(SecurityUtils.getClientIp())
                .build());

        messagePublisher.publishNotificationEvent(NotificationEvent.builder()
                .patientId(savedItem.getPatientId())
                .message("You have been checked in. Your token number is: " + savedItem.getTokenNumber())
                .channel("SMS")
                .build());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedItem);
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<QueueItem>> getDoctorQueue(@PathVariable UUID doctorId) {
        // Return active queue (both WAITING and ACTIVE status)
        List<QueueItem> waitingItems = queueItemRepository.findByDoctorIdAndStatusOrderByTokenNumberAsc(doctorId, "WAITING");
        List<QueueItem> activeItems = queueItemRepository.findByDoctorIdAndStatusOrderByTokenNumberAsc(doctorId, "ACTIVE");
        
        // Return both, active/calling items first
        activeItems.addAll(waitingItems);
        return ResponseEntity.ok(activeItems);
    }

    @PutMapping("/{id}/call")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @Transactional
    public ResponseEntity<QueueItem> callPatient(@PathVariable UUID id) {
        QueueItem item = queueItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Queue item not found with ID: " + id));

        if (!"WAITING".equals(item.getStatus())) {
            throw new IllegalStateException("Only WAITING patients can be called");
        }

        item.setStatus("ACTIVE");
        QueueItem updatedItem = queueItemRepository.save(item);

        messagePublisher.publishAuditEvent(AuditEvent.builder()
                .userId(SecurityUtils.getCurrentUserId())
                .action("QUEUE_CALL_PATIENT")
                .entityType("QueueItem")
                .entityId(updatedItem.getId())
                .clientIp(SecurityUtils.getClientIp())
                .build());

        messagePublisher.publishNotificationEvent(NotificationEvent.builder()
                .patientId(updatedItem.getPatientId())
                .message("Your token " + updatedItem.getTokenNumber() + " is being called. Please proceed to the room.")
                .channel("SMS")
                .build());

        return ResponseEntity.ok(updatedItem);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    @Transactional
    public ResponseEntity<QueueItem> completeConsultation(@PathVariable UUID id) {
        QueueItem item = queueItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Queue item not found with ID: " + id));

        if (!"ACTIVE".equals(item.getStatus())) {
            throw new IllegalStateException("Only currently ACTIVE patients can be marked complete");
        }

        item.setStatus("COMPLETED");
        QueueItem updatedItem = queueItemRepository.save(item);

        messagePublisher.publishAuditEvent(AuditEvent.builder()
                .userId(SecurityUtils.getCurrentUserId())
                .action("QUEUE_COMPLETE_CONSULTATION")
                .entityType("QueueItem")
                .entityId(updatedItem.getId())
                .clientIp(SecurityUtils.getClientIp())
                .build());

        return ResponseEntity.ok(updatedItem);
    }
}
