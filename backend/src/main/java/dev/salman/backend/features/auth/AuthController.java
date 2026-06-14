package dev.salman.backend.features.auth;

import dev.salman.backend.features.auth.dto.LoginRequest;
import dev.salman.backend.features.auth.dto.RegisterRequest;
import dev.salman.backend.features.auth.dto.UserResponse;
import dev.salman.backend.features.auth.entity.User;
import dev.salman.backend.features.auth.repository.UserRepository;
import dev.salman.backend.messaging.MessagePublisher;
import dev.salman.backend.messaging.dto.AuditEvent;
import dev.salman.backend.security.jwt.JwtTokenProvider;
import dev.salman.backend.security.service.CustomUserDetails;
import dev.salman.backend.shared.SecurityUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MessagePublisher messagePublisher;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtTokenProvider tokenProvider,
                          UserRepository userRepository,
                          PasswordEncoder passwordEncoder,
                          MessagePublisher messagePublisher) {
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.messagePublisher = messagePublisher;
    }

    @PostMapping("/login")
    public ResponseEntity<UserResponse> login(@RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        ResponseCookie jwtCookie = tokenProvider.generateJwtCookie(jwt);
        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();

        // Async audit log
        messagePublisher.publishAuditEvent(AuditEvent.builder()
                .userId(user.getId())
                .action("LOGIN")
                .entityType("User")
                .entityId(user.getId())
                .clientIp(SecurityUtils.getClientIp())
                .build());

        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .fullName(user.getFullName())
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletResponse response) {
        UUID currentUserId = SecurityUtils.getCurrentUserId();
        
        ResponseCookie cleanCookie = tokenProvider.getCleanJwtCookie();
        response.addHeader(HttpHeaders.SET_COOKIE, cleanCookie.toString());

        if (currentUserId != null) {
            messagePublisher.publishAuditEvent(AuditEvent.builder()
                    .userId(currentUserId)
                    .action("LOGOUT")
                    .entityType("User")
                    .entityId(currentUserId)
                    .clientIp(SecurityUtils.getClientIp())
                    .build());
        }

        return ResponseEntity.ok().build();
    }

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> register(@RequestBody RegisterRequest registerRequest) {
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            throw new IllegalStateException("Username is already taken");
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(registerRequest.getRole())
                .fullName(registerRequest.getFullName())
                .active(true)
                .build();

        User savedUser = userRepository.save(user);

        messagePublisher.publishAuditEvent(AuditEvent.builder()
                .userId(SecurityUtils.getCurrentUserId())
                .action("REGISTER_STAFF")
                .entityType("User")
                .entityId(savedUser.getId())
                .clientIp(SecurityUtils.getClientIp())
                .build());

        return ResponseEntity.status(HttpStatus.CREATED).body(UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .role(savedUser.getRole())
                .fullName(savedUser.getFullName())
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        User user = userDetails.getUser();
        return ResponseEntity.ok(UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .role(user.getRole())
                .fullName(user.getFullName())
                .build());
    }
}
