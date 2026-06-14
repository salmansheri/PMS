package dev.salman.backend.features.appointment;

import dev.salman.backend.features.appointment.dto.AppointmentRequest;
import dev.salman.backend.features.appointment.entity.Appointment;
import dev.salman.backend.features.appointment.repository.AppointmentRepository;
import dev.salman.backend.features.auth.entity.User;
import dev.salman.backend.features.auth.repository.UserRepository;
import dev.salman.backend.features.patient.repository.PatientRepository;
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
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final MessagePublisher messagePublisher;

    public AppointmentController(AppointmentRepository appointmentRepository,
                                 UserRepository userRepository,
                                 PatientRepository patientRepository,
                                 MessagePublisher messagePublisher) {
        this.appointmentRepository = appointmentRepository;
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.messagePublisher = messagePublisher;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @Transactional
    public ResponseEntity<Appointment> bookAppointment(@RequestBody AppointmentRequest request) {
        // 1. Verify patient exists
        if (!patientRepository.existsById(request.getPatientId())) {
            throw new EntityNotFoundException("Patient not found with ID: " + request.getPatientId());
        }

        // 2. Verify doctor exists and has doctor role
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new EntityNotFoundException("Doctor not found with ID: " + request.getDoctorId()));
        if (!"ROLE_DOCTOR".equals(doctor.getRole())) {
            throw new IllegalStateException("Selected user is not registered as a doctor");
        }

        // 3. Check for booking conflicts (within 30 minute window)
        LocalDateTime start = request.getAppointmentTime().minusMinutes(29);
        LocalDateTime end = request.getAppointmentTime().plusMinutes(29);
        List<Appointment> conflicts = appointmentRepository.findByDoctorIdAndAppointmentTimeBetween(
                request.getDoctorId(), start, end);
        
        // Filter out cancelled appointments from conflict checks
        boolean hasConflict = conflicts.stream()
                .anyMatch(app -> !"CANCELLED".equals(app.getStatus()));
        
        if (hasConflict) {
            throw new IllegalStateException("Doctor has a scheduling conflict within 30 minutes of this time");
        }

        // 4. Save appointment
        Appointment appointment = Appointment.builder()
                .patientId(request.getPatientId())
                .doctorId(request.getDoctorId())
                .appointmentTime(request.getAppointmentTime())
                .notes(request.getNotes())
                .status("SCHEDULED")
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // 5. Publish Audit Event
        messagePublisher.publishAuditEvent(AuditEvent.builder()
                .userId(SecurityUtils.getCurrentUserId())
                .action("BOOK_APPOINTMENT")
                .entityType("Appointment")
                .entityId(savedAppointment.getId())
                .clientIp(SecurityUtils.getClientIp())
                .build());

        // 6. Publish Notification Event (Queue Alert)
        messagePublisher.publishNotificationEvent(NotificationEvent.builder()
                .patientId(savedAppointment.getPatientId())
                .message("Your appointment has been scheduled for " + savedAppointment.getAppointmentTime().toString())
                .channel("SMS")
                .build());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedAppointment);
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable UUID doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorIdOrderByAppointmentTimeAsc(doctorId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable UUID patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientIdOrderByAppointmentTimeDesc(patientId);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'ADMIN')")
    @Transactional
    public ResponseEntity<Appointment> updateAppointmentStatus(@PathVariable UUID id, @RequestParam String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + id));

        // Basic validation on status transition
        String currentStatus = appointment.getStatus();
        if ("COMPLETED".equals(currentStatus) || "CANCELLED".equals(currentStatus)) {
            throw new IllegalStateException("Cannot change status of a completed or cancelled appointment");
        }

        appointment.setStatus(status.toUpperCase());
        Appointment updatedAppointment = appointmentRepository.save(appointment);

        messagePublisher.publishAuditEvent(AuditEvent.builder()
                .userId(SecurityUtils.getCurrentUserId())
                .action("UPDATE_APPOINTMENT_STATUS")
                .entityType("Appointment")
                .entityId(updatedAppointment.getId())
                .clientIp(SecurityUtils.getClientIp())
                .build());

        return ResponseEntity.ok(updatedAppointment);
    }
}
