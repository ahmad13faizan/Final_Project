package com.bootcamp.learning.bootcamp.service.impl;

import com.bootcamp.learning.bootcamp.repository.LoginTokenRepository;
import com.bootcamp.learning.bootcamp.service.TokenCleanupService;
import jakarta.transaction.Transactional;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
public class TokenCleanupServiceImpl implements TokenCleanupService {

    private final LoginTokenRepository tokenRepository;
    private static final long TOKEN_EXPIRY_MINUTES = 15; // set your expiry time here

    public TokenCleanupServiceImpl(LoginTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    @Transactional
    @Scheduled(fixedRate = 30 * 60 * 1000) // runs every 30 minutes
    public void removeExpiredTokens() {
        LocalDateTime expiryCutoff = LocalDateTime.now().minusMinutes(TOKEN_EXPIRY_MINUTES);
        tokenRepository.deleteAllByCreatedAtBefore(expiryCutoff);
        System.out.println("Expired tokens removed at: " + LocalDateTime.now());
    }
}
