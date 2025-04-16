package com.bootcamp.learning.bootcamp.service;

public interface TokenService {

    public String generateToken(String username);
    public String getUsernameFromToken(String token);
    public boolean validateToken(String token);

}
