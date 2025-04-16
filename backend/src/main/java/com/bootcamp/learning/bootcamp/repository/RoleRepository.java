package com.bootcamp.learning.bootcamp.repository;

import com.bootcamp.learning.bootcamp.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;


public interface RoleRepository extends JpaRepository<Role, Long> {

}
