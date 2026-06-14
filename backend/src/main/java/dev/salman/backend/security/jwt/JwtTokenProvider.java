package dev.salman.backend.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final SecretKey key;
    private final long expirationMs;
    private final String cookieName;

    public JwtTokenProvider(
            @Value("${pms.security.jwt.secret}") String secret,
            @Value("${pms.security.jwt.expiration-ms}") long expirationMs,
            @Value("${pms.security.jwt.cookie-name}") String cookieName) {
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
        this.expirationMs = expirationMs;
        this.cookieName = cookieName;
    }

    public String generateToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        String roles = userPrincipal.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        return Jwts.builder()
                .subject(userPrincipal.getUsername())
                .claim("roles", roles)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            logger.error("JWT validation failed: {}", e.getMessage());
        }
        return false;
    }

    public String resolveToken(HttpServletRequest request) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookieName.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        // Fallback to Header-based Authorization (e.g. Bearer token) for APIs / testing
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }

    public ResponseCookie generateJwtCookie(String jwt) {
        return ResponseCookie.from(cookieName, jwt)
                .path("/api")
                .maxAge(expirationMs / 1000)
                .httpOnly(true)
                .secure(true) // Should be secure in production (HTTPS)
                .sameSite("Strict")
                .build();
    }

    public ResponseCookie getCleanJwtCookie() {
        return ResponseCookie.from(cookieName, "")
                .path("/api")
                .maxAge(0)
                .httpOnly(true)
                .secure(true)
                .sameSite("Strict")
                .build();
    }
}
