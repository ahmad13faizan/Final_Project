package com.bootcamp.learning.bootcamp.service.impl;

import com.bootcamp.learning.bootcamp.service.TokenService;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenServiceImpl implements TokenService {
    private final ConcurrentHashMap<String, String> tokenStore = new ConcurrentHashMap<>();

    public String generateToken(String username) {
        String token = UUID.randomUUID().toString();
        tokenStore.put(token, username); // or userId, your call
        return token;
    }

    public String getUsernameFromToken(String token) {
        return tokenStore.get(token);
    }

    @Override
    public boolean validateToken(String token) {
        return tokenStore.containsKey(token);
    }

    public void invalidateToken(String token) {
        tokenStore.remove(token);
    }

    public boolean isTokenValid(String token) {
        return tokenStore.containsKey(token);
    }

    public void invalidateAllTokens() {
        tokenStore.clear();
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        TokenServiceImpl that = (TokenServiceImpl) o;
        return Objects.equals(tokenStore, that.tokenStore);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(tokenStore);
    }
}
