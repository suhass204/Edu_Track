package com.edutrack;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertTrue;

class EduTrackApplicationTests {

    @Test
    void passwordEncoderHashesAndMatches() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String hash = encoder.encode("admin123");
        assertTrue(encoder.matches("admin123", hash));
    }
}
