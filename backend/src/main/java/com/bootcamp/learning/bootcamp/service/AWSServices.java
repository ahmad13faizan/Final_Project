package com.bootcamp.learning.bootcamp.service;

import com.bootcamp.learning.bootcamp.dto.Ec2InstanceDto;
import com.bootcamp.learning.bootcamp.entity.Accounts;

import java.util.List;

public interface AWSServices {
    List<Ec2InstanceDto> fetchInstances(Accounts account);
}
