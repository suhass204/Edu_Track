package com.edutrack.service;

import com.edutrack.model.Admin;
import com.edutrack.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${edutrack.admin.seed-username}")
    private String seedUsername;
    @Value("${edutrack.admin.seed-email}")
    private String seedEmail;
    @Value("${edutrack.admin.seed-password}")
    private String seedPassword;

    public AdminSeeder(AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (adminRepository.findByUsername(seedUsername).isEmpty()) {
            Admin admin = new Admin(seedEmail, seedUsername, passwordEncoder.encode(seedPassword));
            adminRepository.save(admin);
        }
    }
}
