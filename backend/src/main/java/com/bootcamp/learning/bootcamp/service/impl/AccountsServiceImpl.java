package com.bootcamp.learning.bootcamp.service.impl;

import com.bootcamp.learning.bootcamp.entity.Accounts;
import com.bootcamp.learning.bootcamp.repository.AccountsRepository;
import com.bootcamp.learning.bootcamp.service.AccountsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AccountsServiceImpl implements AccountsService {

    @Autowired
    private AccountsRepository repository;

    public List<Accounts> getAllResources() {
        return repository.findAll();
    }

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
}
