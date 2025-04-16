package com.bootcamp.learning.bootcamp.controller;

import com.bootcamp.learning.bootcamp.dto.*;
import com.bootcamp.learning.bootcamp.entity.User;
import com.bootcamp.learning.bootcamp.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testTestEndpoint() throws Exception {
        mockMvc.perform(get("/api/test"))
                .andExpect(status().isOk())
                .andExpect(content().string("Test"));
    }

    @Test
    public void testRegister() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("Password@123");
        request.setPassword2("Password@123");
        request.setRoleId(2L); // assuming roleId 2 corresponds to "USER"
        request.setUsername("TestUser");

        when(userService.registerUser(any(RegisterRequest.class)))
                .thenReturn(ResponseEntity.ok("Registered"));

        mockMvc.perform(post("/api/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(content().string("Registered"));
    }

    @Test
    public void testLogin() throws Exception {
        LoginDTO loginDTO = new LoginDTO();
        loginDTO.setEmail("test@example.com");
        loginDTO.setPassword("password");

        LoginResponseDTO response = new LoginResponseDTO("Login successful", "USER", "token123");

        when(userService.login(anyString(), anyString()))
                .thenReturn(response);

        mockMvc.perform(post("/api/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Login successful"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.token").value("token123"));
    }

    @Test
    public void testLogout() throws Exception {
        when(userService.logout("Bearer token")).thenReturn("Logged out");

        mockMvc.perform(post("/api/logout")
                        .header("Authorization", "Bearer token"))
                .andExpect(status().isOk())
                .andExpect(content().string("Logged out"));
    }

    @Test
    public void testGetAllRoles() throws Exception {
        List<Map<String, Object>> roles = List.of(
                Map.of("id", 1, "name", "ADMIN"),
                Map.of("id", 2, "name", "USER")
        );

        when(userService.getAllRoleNames()).thenReturn(roles);

        mockMvc.perform(get("/api/roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].name").value("ADMIN"));
    }

    @Test
    public void testGetAllUsers() throws Exception {
        List<UserDTO> users = List.of(
                new UserDTO(1L, "test@example.com", "TestUser", "USER", new Date())
        );

        when(userService.getAllUsers()).thenReturn(users);

        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].email").value("test@example.com"));
    }
}
