package com.bootcamp.learning.bootcamp.controller;

import com.bootcamp.learning.bootcamp.dto.Ec2InstanceDto;
import com.bootcamp.learning.bootcamp.service.AWSServices;
import com.bootcamp.learning.bootcamp.service.AccountsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/AWSAccount")
public class AWSAccountsController {

    @Autowired
    private AWSServices awsServices;

    @Autowired
    private AccountsService service;

    @GetMapping("/{id}/ec2")
    public ResponseEntity<List<Ec2InstanceDto>> getEc2Instances(@PathVariable Long id) {
        return service.getResourceById(id)
                .map(account -> {
                    List<Ec2InstanceDto> instances = awsServices.fetchInstances(account);
                    return ResponseEntity.ok(instances);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
