package com.bootcamp.learning.bootcamp.dto;

import com.bootcamp.learning.bootcamp.enums.RoleType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

@Getter @Setter
@Data
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String email;
    private String username;
    private RoleType role;
    private Date lastLogin;
}
