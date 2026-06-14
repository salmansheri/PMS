package dev.salman.backend.config;

import dev.salman.backend.features.auth.entity.User;
import dev.salman.backend.features.auth.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            // Seed Admin
            User admin = User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ROLE_ADMIN")
                    .fullName("System Administrator")
                    .active(true)
                    .build();
            userRepository.save(admin);

            // Seed Doctor
            User doctor = User.builder()
                    .username("doctor")
                    .password(passwordEncoder.encode("doctor123"))
                    .role("ROLE_DOCTOR")
                    .fullName("Dr. Kenji Sato")
                    .active(true)
                    .build();
            userRepository.save(doctor);

            // Seed Receptionist
            User receptionist = User.builder()
                    .username("receptionist")
                    .password(passwordEncoder.encode("recept123"))
                    .role("ROLE_RECEPTIONIST")
                    .fullName("Hana Tanaka")
                    .active(true)
                    .build();
            userRepository.save(receptionist);

            System.out.println("--- Seeded Default Users into Database ---");
            System.out.println("Admin: admin / admin123");
            System.out.println("Doctor: doctor / doctor123");
            System.out.println("Receptionist: receptionist / recept123");
            System.out.println("-----------------------------------------");
        }
    }
}
