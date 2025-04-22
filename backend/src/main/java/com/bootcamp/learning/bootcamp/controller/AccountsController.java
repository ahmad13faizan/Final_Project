package com.bootcamp.learning.bootcamp.controller;

import com.bootcamp.learning.bootcamp.dto.AccountsDTO;
import com.bootcamp.learning.bootcamp.entity.Accounts;
import com.bootcamp.learning.bootcamp.service.AccountsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "*")
public class AccountsController {

    @Autowired
    private AccountsService service;

    @GetMapping
    public List<Accounts> getAllResources() {
        return service.getAllResources();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Accounts> getResourceById(@PathVariable Long id) {
        return service.getResourceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // In AccountsController.java:
    @PostMapping
    public ResponseEntity<Accounts> createResource(@Valid @RequestBody AccountsDTO dto) {

        Accounts resource = Accounts.builder()
                .AccountId(dto.getAccountId())
                .AccountName(dto.getAccountName())
                .region(dto.getRegion())
                .arn(dto.getArn())
                .isOrphan(true)
                        .build(  );

        return ResponseEntity.ok(service.createResource(resource));
    }



    @PutMapping("/{id}")
    public ResponseEntity<Accounts> updateResource(
            @PathVariable Long id,
            @RequestBody Accounts resource) {
        if (service.getResourceById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(service.updateResource(id, resource));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        if (service.getResourceById(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        service.deleteResource(id);
        return ResponseEntity.noContent().build();
    }
}
