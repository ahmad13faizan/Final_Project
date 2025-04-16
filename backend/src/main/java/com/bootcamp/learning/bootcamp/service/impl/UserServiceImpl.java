package com.bootcamp.learning.bootcamp.service.impl;

import com.bootcamp.learning.bootcamp.UserDetails.CustomUserDetails;
import com.bootcamp.learning.bootcamp.dto.LoginResponseDTO;
import com.bootcamp.learning.bootcamp.dto.RegisterRequest;
import com.bootcamp.learning.bootcamp.dto.UserDTO;
import com.bootcamp.learning.bootcamp.entity.Accounts;
import com.bootcamp.learning.bootcamp.entity.LoginToken;
import com.bootcamp.learning.bootcamp.entity.Role;
import com.bootcamp.learning.bootcamp.entity.User;
import com.bootcamp.learning.bootcamp.repository.AccountsRepository;
import com.bootcamp.learning.bootcamp.repository.LoginTokenRepository;
import com.bootcamp.learning.bootcamp.repository.RoleRepository;
import com.bootcamp.learning.bootcamp.repository.UserRepository;
import com.bootcamp.learning.bootcamp.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;


@Service
public class UserServiceImpl implements UserService {

    private final AuthenticationManager authenticationManager;

    public UserServiceImpl(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }


// inside UserServiceImpl

    @Autowired
    private LoginTokenRepository tokenRepository;

    @Autowired
    AccountsRepository accountsRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @Override
    public List<Map<String, Object>> getAllRoleNames() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(role -> {
                    Map<String, Object> map = new LinkedHashMap<>();
                    map.put("id", role.getId());
                    map.put("name", role.getName());
                    return map;
                })
                .collect(Collectors.toList());
    }


    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getEmail(),
                        user.getUsername(),
                        user.getRole().getName(),
                        user.getLastLogin()
                ))
                .toList();
    }

    @Transactional
    public String logout(String token) {
        Optional<LoginToken> loginTokenOpt = tokenRepository.findByToken(token);
        if (loginTokenOpt.isPresent()) {
            User user = loginTokenOpt.get().getUser();
            tokenRepository.deleteByUser(user);
            return "Logout successful.";
        } else {
            return "Invalid token or already logged out.";
        }
    }

    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            return ResponseEntity.badRequest().body("❌ Email already exists");
        }

        if (!request.getPassword().equals(request.getPassword2())) {
            return ResponseEntity.badRequest().body("❌ Passwords do not match");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("❌ Role not found: " + request.getRoleId()));

        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(role);
        newUser.setUsername(request.getUsername());

        // ✅ Link Accounts to User
        if (request.getAccountIds() != null && !request.getAccountIds().isEmpty()) {
            List<Accounts> accounts = accountsRepository.findAllById(request.getAccountIds());
            newUser.setAccounts(accounts);
        }

        userRepository.save(newUser);
        return ResponseEntity.ok("✅ User registered successfully");
    }



    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody RegisterRequest request) {
        // Fetch the user by ID
        User userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ User not found with id: " + id));

        // Optionally check for email duplication if updating email (if applicable)
        Optional<User> existingUserByEmail = userRepository.findByEmail(request.getEmail());
        if (existingUserByEmail.isPresent() && !existingUserByEmail.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body("❌ Email already exists");
        }

        // Check if passwords are provided and match before updating them
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (!request.getPassword().equals(request.getPassword2())) {
                return ResponseEntity.badRequest().body("❌ Passwords do not match");
            }
            userToUpdate.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // Update other fields
        userToUpdate.setEmail(request.getEmail());
        userToUpdate.setUsername(request.getUsername());

        // Retrieve role by id and update
        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("❌ Role not found: " + request.getRoleId()));
        userToUpdate.setRole(role);

        // Link Accounts to User (for many-to-many relationship)
        if (request.getAccountIds() != null && !request.getAccountIds().isEmpty()) {
            List<Accounts> accounts = accountsRepository.findAllById(request.getAccountIds());
            userToUpdate.setAccounts(accounts);
        }

        // Save the updated user entity
        userRepository.save(userToUpdate);

        return ResponseEntity.ok("✅ User updated successfully");
    }



    @Override
    public LoginResponseDTO login(String username, String password) {
        try {
            // 🔐 Authenticate user
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            // ✅ Update last login time
            user.setLastLogin(new Date());
            userRepository.save(user); // Don't forget to persist it!

            // 🔑 Generate or reuse token
            Optional<LoginToken> existing = tokenRepository.findByUser(user);
            String randomToken = UUID.randomUUID().toString();

            LoginToken loginToken = existing.orElseGet(LoginToken::new);
            loginToken.setToken(randomToken);
            loginToken.setCreatedAt(LocalDateTime.now());
            loginToken.setUser(user);

            // 💾 Save token to DB
            tokenRepository.save(loginToken);

            return new LoginResponseDTO("Login successful", user.getRole().getName(), randomToken);

        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid username or password");
        }
    }




}
