package com.bootcamp.learning.bootcamp.controller;


import com.bootcamp.learning.bootcamp.dto.LoginDTO;
import com.bootcamp.learning.bootcamp.dto.LoginResponseDTO;
import com.bootcamp.learning.bootcamp.dto.RegisterRequest;
import com.bootcamp.learning.bootcamp.dto.UserDTO;
import com.bootcamp.learning.bootcamp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {


    @Autowired
    private UserService userService;

    @GetMapping("/test")
    public String test() {
        return "Test";
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(userService.logout(token));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login( @Valid @RequestBody LoginDTO request) {
        LoginResponseDTO response = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Map<String, Object>>> getAllRoleNames() {
        List<Map<String, Object>> roleNames = userService.getAllRoleNames();
        if (roleNames.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(roleNames);
    }

    @GetMapping("/users")
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }
    @PutMapping("users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody RegisterRequest request) {
     return userService.updateUser(id,request);
    }


}




