package dev.salman.backend.features.patient;

import dev.salman.backend.features.patient.dto.MedicalRecordRequest;
import dev.salman.backend.features.patient.dto.PatientRequest;
import dev.salman.backend.features.patient.entity.MedicalRecord;
import dev.salman.backend.features.patient.entity.Patient;
import dev.salman.backend.features.patient.repository.MedicalRecordRepository;
import dev.salman.backend.features.patient.repository.PatientRepository;
import dev.salman.backend.messaging.MessagePublisher;
import dev.salman.backend.messaging.dto.AuditEvent;
import dev.salman.backend.shared.SecurityUtils;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/patients")
public class PatientController {

    private final PatientRepository patientRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final MessagePublisher messagePublisher;

    public PatientController(PatientRepository patientRepository,
                             MedicalRecordRepository medicalRecordRepository,
                             MessagePublisher messagePublisher) {
        this.patientRepository = patientRepository;
        this.medicalRecordRepository = medicalRecordRepository;
        this.messagePublisher = messagePublisher;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    public ResponseEntity<Patient> registerPatient(@RequestBody PatientRequest request) {
        String maskedSsn = maskSsn(request.getSsn());

        Patient patient = Patient.builder()
                .name(request.getName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .ssnMasked(maskedSsn)
                .phone(request.getPhone())
                .email(request.getEmail())
                .bloodType(request.getBloodType())
                .emergencyContactName(request.getEmergencyContactName())
                .emergencyContactPhone(request.getEmergencyContactPhone())
                .build();

        Patient savedPatient = patientRepository.save(patient);

        messagePublisher.publishAuditEvent(AuditEvent.builder()
                .userId(SecurityUtils.getCurrentUserId())
                .action("INTAKE_PATIENT")
                .entityType("Patient")
                .entityId(savedPatient.getId())
                .clientIp(SecurityUtils.getClientIp())
                .build());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedPatient);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'ADMIN')")
    @Cacheable(value = "patients", key = "#id")
    public ResponseEntity<Patient> getPatientById(@PathVariable UUID id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + id));
        return ResponseEntity.ok(patient);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'ADMIN')")
    @CacheEvict(value = "patients", key = "#id")
    public ResponseEntity<Patient> updatePatient(@PathVariable UUID id, @RequestBody PatientRequest request) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Patient not found with ID: " + id));

        patient.setName(request.getName());
        patient.setDateOfBirth(request.getDateOfBirth());
        patient.setGender(request.getGender());
        patient.setPhone(request.getPhone());
        patient.setEmail(request.getEmail());
        patient.setBloodType(request.getBloodType());
        patient.setEmergencyContactName(request.getEmergencyContactName());
        patient.setEmergencyContactPhone(request.getEmergencyContactPhone());

        if (request.getSsn() != null && !request.getSsn().isEmpty()) {
            patient.setSsnMasked(maskSsn(request.getSsn()));
        }

        Patient updatedPatient = patientRepository.save(patient);

        messagePublisher.publishAuditEvent(AuditEvent.builder()
                .userId(SecurityUtils.getCurrentUserId())
                .action("UPDATE_PATIENT")
                .entityType("Patient")
                .entityId(updatedPatient.getId())
                .clientIp(SecurityUtils.getClientIp())
                .build());

        return ResponseEntity.ok(updatedPatient);
    }

    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'ADMIN')")
    public ResponseEntity<List<Patient>> searchPatients(@RequestParam String name) {
        List<Patient> patients = patientRepository.findByNameContainingIgnoreCase(name);
        return ResponseEntity.ok(patients);
    }

    @PostMapping("/{id}/records")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<MedicalRecord> addMedicalRecord(@PathVariable("id") UUID patientId,
                                                          @RequestBody MedicalRecordRequest request) {
        
        if (!patientRepository.existsById(patientId)) {
            throw new EntityNotFoundException("Patient not found with ID: " + patientId);
        }

        MedicalRecord record = MedicalRecord.builder()
                .patientId(patientId)
                .doctorId(SecurityUtils.getCurrentUserId())
                .conditions(request.getConditions())
                .allergies(request.getAllergies())
                .vitals(request.getVitals())
                .build();

        MedicalRecord savedRecord = medicalRecordRepository.save(record);

        messagePublisher.publishAuditEvent(AuditEvent.builder()
                .userId(SecurityUtils.getCurrentUserId())
                .action("ADD_MEDICAL_RECORD")
                .entityType("MedicalRecord")
                .entityId(savedRecord.getId())
                .clientIp(SecurityUtils.getClientIp())
                .build());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedRecord);
    }

    @GetMapping("/{id}/records")
    @PreAuthorize("hasAnyRole('DOCTOR', 'ADMIN')")
    public ResponseEntity<List<MedicalRecord>> getMedicalRecords(@PathVariable("id") UUID patientId) {
        if (!patientRepository.existsById(patientId)) {
            throw new EntityNotFoundException("Patient not found with ID: " + patientId);
        }
        List<MedicalRecord> records = medicalRecordRepository.findByPatientIdOrderByCreatedAtDesc(patientId);
        return ResponseEntity.ok(records);
    }

    private String maskSsn(String ssn) {
        if (ssn == null || ssn.length() < 4) {
            return "***-**-XXXX";
        }
        String lastFour = ssn.substring(ssn.length() - 4);
        return "***-**-" + lastFour;
    }
}
