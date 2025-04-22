package com.bootcamp.learning.bootcamp.repository;

import com.bootcamp.learning.bootcamp.entity.Accounts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountsRepository extends JpaRepository<Accounts, Long> {
    // custom queries
}
