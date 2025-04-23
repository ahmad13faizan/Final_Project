package com.bootcamp.learning.bootcamp.service.impl;

import com.bootcamp.learning.bootcamp.dto.AccountSummaryDTO;
import com.bootcamp.learning.bootcamp.entity.Accounts;
import com.bootcamp.learning.bootcamp.entity.User;
import com.bootcamp.learning.bootcamp.enums.RoleType;
import com.bootcamp.learning.bootcamp.repository.AccountsRepository;
import com.bootcamp.learning.bootcamp.service.AccountsService;
import com.bootcamp.learning.bootcamp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountsServiceImpl implements AccountsService {

    @Autowired
    private AccountsRepository repository;

    @Autowired
    private UserService userService;

    public Optional<Accounts> getResourceById(Long id) {
        return repository.findById(id);
    }

    public Accounts createResource(Accounts resource) {
        return repository.save(resource);
    }

    public Accounts updateResource(Long id, Accounts resource) {
        resource.setAccountId(id);
        return repository.save(resource);
    }

    public void deleteResource(Long id) {
        repository.deleteById(id);
    }

    public List<AccountSummaryDTO> getAccounts(Authentication authentication) {
        User user = userService.findByEmail(authentication.getName());
        RoleType roleName = user.getRole().getName();

        List<Accounts> accounts;
        if (roleName == RoleType.ROLE_ADMIN || roleName == RoleType.ROLE_READ_ONLY) {
            accounts = repository.findAll();
        } else if (roleName == RoleType.ROLE_CUSTOMER) {
            accounts = user.getAccounts(); // ManyToMany
        } else {
            throw new AccessDeniedException("Unauthorized role");
        }

        // Convert to DTO
        return accounts.stream()
                .map(acc -> new AccountSummaryDTO(acc.getAccountId(), acc.getAccountName()))
                .toList();
    }

}
