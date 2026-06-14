package dev.salman.backend.features.patient.repository;

import dev.salman.backend.features.patient.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, UUID> {
    List<MedicalRecord> findByPatientIdOrderByCreatedAtDesc(UUID patientId);
}
