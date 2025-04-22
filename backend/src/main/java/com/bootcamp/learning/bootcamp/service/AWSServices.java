package com.bootcamp.learning.bootcamp.service;

import com.bootcamp.learning.bootcamp.dto.AsgDto;
import com.bootcamp.learning.bootcamp.dto.Ec2InstanceDto;
import com.bootcamp.learning.bootcamp.dto.RdsInstanceDto;

import java.util.List;

public interface AWSServices {
    List<RdsInstanceDto> fetchRdsInstances(Long id);
    List<Ec2InstanceDto> fetchInstances(Long id);
    List<AsgDto> fetchAutoScalingGroups(Long id);
}
