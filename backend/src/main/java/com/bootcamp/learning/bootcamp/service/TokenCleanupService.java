package com.bootcamp.learning.bootcamp.service;

public interface TokenCleanupService {

    long TOKEN_EXPIRY_MINUTES = 1; // set your expiry time here

    void removeExpiredTokens() ;
}
