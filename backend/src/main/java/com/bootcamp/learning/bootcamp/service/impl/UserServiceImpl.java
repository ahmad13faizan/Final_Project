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

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final AuthenticationManager authenticationManager;

    @Autowired
    private LoginTokenRepository tokenRepository;

    @Autowired
    private AccountsRepository accountsRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    @Override
    public List<Map<String, Object>> getAllRoleNames() {
        List<Role> roles = roleRepository.findAll();
        if (roles.isEmpty()) {
            throw new RuntimeException("No roles found in the system.");
        }

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
        List<UserDTO> users = userRepository.findAll().stream()
                .map(user -> new UserDTO(
                        user.getId(),
                        user.getEmail(),
                        user.getUsername(),
                        user.getRole().getName(),
                        user.getLastLogin()
                ))
                .collect(Collectors.toList());

        if (users.isEmpty()) {
            throw new RuntimeException("No users found.");
        }

        return users;
    }

    @Transactional
    @Override
    public String logout(String token) {
        Optional<LoginToken> loginTokenOpt = tokenRepository.findByToken(token);
        if (!loginTokenOpt.isPresent()) {
            throw new RuntimeException("Invalid or expired token.");
        }

        User user = loginTokenOpt.get().getUser();
        tokenRepository.deleteByUser(user);
        return "Logout successful.";
    }

    @Override
    public ResponseEntity<String> registerUser(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail());

        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already exists.");
        }

        if (!request.getPassword().equals(request.getPassword2())) {
            throw new RuntimeException("Passwords do not match.");
        }

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + request.getRoleId()));

        User newUser = new User();
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(role);
        newUser.setUsername(request.getUsername());

        if (request.getAccountIds() != null && !request.getAccountIds().isEmpty()) {
            List<Accounts> accounts = accountsRepository.findAllById(request.getAccountIds());
            for (Accounts account : accounts) {
                account.setIsOrphan(false);
            }
            newUser.setAccounts(accounts);
            accountsRepository.saveAll(accounts);
        }

        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully.");
    }

    @Override
    public ResponseEntity<String> updateUser(Long id, RegisterRequest request) {
        User userToUpdate = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));

        Optional<User> existingUserByEmail = userRepository.findByEmail(request.getEmail());
        if (existingUserByEmail.isPresent() && !existingUserByEmail.get().getId().equals(id)) {
            throw new RuntimeException("Email already exists.");
        }

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            if (!request.getPassword().equals(request.getPassword2())) {
                throw new RuntimeException("Passwords do not match.");
            }
            userToUpdate.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        userToUpdate.setEmail(request.getEmail());
        userToUpdate.setUsername(request.getUsername());

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + request.getRoleId()));
        userToUpdate.setRole(role);

        if (request.getAccountIds() != null && !request.getAccountIds().isEmpty()) {
            List<Accounts> accounts = accountsRepository.findAllById(request.getAccountIds());
            for (Accounts account : accounts) {
                account.setIsOrphan(false);
            }
            userToUpdate.setAccounts(accounts);
            accountsRepository.saveAll(accounts);
        }

        userRepository.save(userToUpdate);
        return ResponseEntity.ok("User updated successfully.");
    }

    @Override
    public LoginResponseDTO login(String username, String password) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
            User user = userDetails.getUser();

            user.setLastLogin(new Date());
            userRepository.save(user);

            Optional<LoginToken> existing = tokenRepository.findByUser(user);
            String randomToken = UUID.randomUUID().toString();

            LoginToken loginToken = existing.orElseGet(LoginToken::new);
            loginToken.setToken(randomToken);
            loginToken.setCreatedAt(LocalDateTime.now());
            loginToken.setUser(user);

            tokenRepository.save(loginToken);

            return new LoginResponseDTO("Login successful", user.getRole().getName(), randomToken);
        } catch (BadCredentialsException e) {
            throw new RuntimeException("Invalid username or password.");
        }
    }
}
