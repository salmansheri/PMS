package dev.salman.backend.features.appointment.repository;

import dev.salman.backend.features.appointment.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByDoctorIdAndAppointmentTimeBetween(UUID doctorId, LocalDateTime start, LocalDateTime end);
    List<Appointment> findByPatientIdOrderByAppointmentTimeDesc(UUID patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentTimeAsc(UUID doctorId);
}
