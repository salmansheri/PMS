package dev.salman.backend.features.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // ROLE_ADMIN, ROLE_DOCTOR, ROLE_RECEPTIONIST

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Builder.Default
    private boolean active = true;
}
