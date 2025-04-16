package com.bootcamp.learning.bootcamp.dto;


import com.bootcamp.learning.bootcamp.enums.RoleType;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class LoginResponseDTO {
    private String message;
    private RoleType role;
    private String token;

    public LoginResponseDTO(String message, RoleType role, String token) {
        this.message = message;
        this.role = role;
        this.token = token;
        
    }
}
