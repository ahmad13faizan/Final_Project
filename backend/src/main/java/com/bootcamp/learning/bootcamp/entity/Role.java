package com.bootcamp.learning.bootcamp.entity;

import com.bootcamp.learning.bootcamp.enums.RoleType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "roles")
@Getter @Setter
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING) // Stores as string in the DB
    private RoleType name; // Use Enum here

    @OneToMany(mappedBy = "role")
    private List<User> users;
}
