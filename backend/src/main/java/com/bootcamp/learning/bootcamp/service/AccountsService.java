package com.bootcamp.learning.bootcamp.service;

import com.bootcamp.learning.bootcamp.entity.Accounts;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.Optional;

public interface AccountsService{

    Optional<Accounts> getResourceById(Long id);
    Accounts createResource(Accounts resource);
    Accounts updateResource(Long id, Accounts resource);
    void deleteResource(Long id);
    List<Accounts> getAccounts(Authentication authentication);

}
