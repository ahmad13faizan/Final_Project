package com.bootcamp.learning.bootcamp.controller;

import com.bootcamp.learning.bootcamp.dto.AsgDto;
import com.bootcamp.learning.bootcamp.dto.Ec2InstanceDto;
import com.bootcamp.learning.bootcamp.dto.RdsInstanceDto;
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
        List<Ec2InstanceDto> instances = awsServices.fetchInstances(id);
        return ResponseEntity.ok(instances);
    }

    @GetMapping("/{id}/rds")
    public ResponseEntity<List<RdsInstanceDto>> getRdsInstances(@PathVariable Long id) {
        List<RdsInstanceDto> instances = awsServices.fetchRdsInstances(id);
        return ResponseEntity.ok(instances);
    }

    @GetMapping("/{id}/asg")
    public ResponseEntity<List<AsgDto>> getAsgGroups(@PathVariable Long id) {
        List<AsgDto> groups = awsServices.fetchAutoScalingGroups(id);
        return ResponseEntity.ok(groups);
    }


}
