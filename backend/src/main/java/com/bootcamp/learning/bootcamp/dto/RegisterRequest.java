package com.bootcamp.learning.bootcamp.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.*;

import java.util.List;

@Getter @Setter
public class RegisterRequest {

    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password cannot be empty")
    @Pattern(
            regexp = "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[@#$%^&+=!]).{8,}$",
            message = "Password must be at least 8 characters long and include a number, a letter, and a special character"
    )
    private String password;

    @NotBlank(message = "Please confirm your password")
    private String password2; // You can match this in service layer

    @NotNull(message = "Role ID must be provided")
    private Long roleId;

    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 20, message = "Username must be between 3 and 20 characters")
    private String username;

    private List<Long> accountIds;



    @Override
    public String toString() {
        return "RegisterRequest{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", password2='" + password2 + '\'' +
                ", roleId=" + roleId +
                ", username='" + username + '\'' +
                '}';
    }

}
