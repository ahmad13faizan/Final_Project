package com.bootcamp.learning.bootcamp.controller;

import com.bootcamp.learning.bootcamp.dto.LoginDTO;
import com.bootcamp.learning.bootcamp.dto.LoginResponseDTO;
import com.bootcamp.learning.bootcamp.dto.RegisterRequest;
import com.bootcamp.learning.bootcamp.dto.UserDTO;
import com.bootcamp.learning.bootcamp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return new ResponseEntity<>("Test", HttpStatus.OK);
    }



    @Secured("ROLE_ADMIN")
    @PostMapping("/users")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(userService.registerUser(request).getBody(), HttpStatus.CREATED);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String token) {
        return new ResponseEntity<>(userService.logout(token), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginDTO request) {
        return new ResponseEntity<>(userService.login(request.getEmail(), request.getPassword()), HttpStatus.OK);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Map<String, Object>>> getAllRoleNames() {
        return new ResponseEntity<>(userService.getAllRoleNames(), HttpStatus.OK);
    }

    @Secured({"ROLE_ADMIN", "ROLE_READ_ONLY"})
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @Secured("ROLE_ADMIN")
    @PutMapping("/users/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody RegisterRequest request) {
        return new ResponseEntity<>(userService.updateUser(id, request).getBody(), HttpStatus.OK);
    }
}
