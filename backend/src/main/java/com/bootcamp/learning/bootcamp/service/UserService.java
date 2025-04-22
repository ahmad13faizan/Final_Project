package com.bootcamp.learning.bootcamp.service;


import com.bootcamp.learning.bootcamp.dto.LoginResponseDTO;
import com.bootcamp.learning.bootcamp.dto.RegisterRequest;
import com.bootcamp.learning.bootcamp.dto.UserDTO;
import com.bootcamp.learning.bootcamp.entity.User;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

public interface UserService {
    LoginResponseDTO login(String username, String password);

    ResponseEntity<String> registerUser(RegisterRequest request);

    User findByEmail(String email);

    List<Map<String, Object>> getAllRoleNames();

    List<UserDTO> getAllUsers();

    String logout(String token);

    ResponseEntity<String> updateUser(Long id, RegisterRequest request);
}

