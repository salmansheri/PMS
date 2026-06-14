package dev.salman.backend.features.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.salman.backend.config.TestInfrastructureConfig;
import dev.salman.backend.features.auth.dto.LoginRequest;
import dev.salman.backend.features.auth.dto.RegisterRequest;
import dev.salman.backend.features.auth.entity.User;
import dev.salman.backend.features.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@Import(TestInfrastructureConfig.class)
public class AuthControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private WebApplicationContext webApplicationContext;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext)
                .apply(SecurityMockMvcConfigurers.springSecurity())
                .build();

        userRepository.deleteAll();
        
        // Seed standard users
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("adminpass"))
                .role("ROLE_ADMIN")
                .fullName("System Administrator")
                .active(true)
                .build();
        userRepository.save(admin);
    }

    @Test
    void shouldLoginSuccessfullyAndSetCookie() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "adminpass");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isOk())
                .andExpect(header().exists(HttpHeaders.SET_COOKIE))
                .andExpect(header().string(HttpHeaders.SET_COOKIE, containsString("token=")))
                .andExpect(jsonPath("$.username").value("admin"))
                .andExpect(jsonPath("$.role").value("ROLE_ADMIN"));
    }

    @Test
    void shouldFailLoginWithBadCredentials() throws Exception {
        LoginRequest loginRequest = new LoginRequest("admin", "wrongpass");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andDo(MockMvcResultHandlers.print())
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    void shouldDenyRegistrationWithoutAuth() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("newdoctor")
                .password("docpass")
                .role("ROLE_DOCTOR")
                .fullName("Dr. House")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void shouldAllowAdminToRegisterNewStaff() throws Exception {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .username("newdoctor")
                .password("docpass")
                .role("ROLE_DOCTOR")
                .fullName("Dr. House")
                .build();

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.username").value("newdoctor"))
                .andExpect(jsonPath("$.role").value("ROLE_DOCTOR"));
    }
}
