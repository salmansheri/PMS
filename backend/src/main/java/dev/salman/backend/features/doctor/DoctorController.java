package dev.salman.backend.features.doctor;

import dev.salman.backend.features.auth.entity.User;
import dev.salman.backend.features.auth.repository.UserRepository;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    private final UserRepository userRepository;

    public DoctorController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('RECEPTIONIST', 'DOCTOR', 'ADMIN')")
    @Cacheable(value = "doctors", key = "'all'")
    public ResponseEntity<List<DoctorResponse>> getDoctors() {
        List<User> doctors = userRepository.findByRole("ROLE_DOCTOR");
        List<DoctorResponse> responses = doctors.stream()
                .filter(User::isActive)
                .map(user -> DoctorResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .fullName(user.getFullName())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }
}
