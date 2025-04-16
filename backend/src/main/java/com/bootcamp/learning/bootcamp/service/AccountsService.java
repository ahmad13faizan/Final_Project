package com.bootcamp.learning.bootcamp.service;

import com.bootcamp.learning.bootcamp.entity.Accounts;

import java.util.List;
import java.util.Optional;

public interface AccountsService{

    List<Accounts> getAllResources();
    Optional<Accounts> getResourceById(int id);
    Accounts createResource(Accounts resource);
    Accounts updateResource(int id, Accounts resource);
    void deleteResource(int id);
}
