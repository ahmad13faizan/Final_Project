// src/main/java/com/bootcamp/learning/bootcamp/service/impl/AWSServicesImpl.java
package com.bootcamp.learning.bootcamp.service.impl;

import com.bootcamp.learning.bootcamp.dto.AsgDto;
import com.bootcamp.learning.bootcamp.dto.Ec2InstanceDto;
import com.bootcamp.learning.bootcamp.dto.RdsInstanceDto;
import com.bootcamp.learning.bootcamp.entity.Accounts;
import com.bootcamp.learning.bootcamp.service.AWSServices;
import com.bootcamp.learning.bootcamp.util.AwsHelperService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.autoscaling.AutoScalingClient;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.rds.RdsClient;

import java.util.ArrayList;
import java.util.List;

@Service
public class AWSServicesImpl implements AWSServices {

    @Autowired
    private AwsHelperService awsHelper;

    @Override
    public List<Ec2InstanceDto> fetchInstances(Long id) {
        try {
            Accounts account = awsHelper.getAccountOrThrow(id);
            Region region = awsHelper.getRegion(account);

            Ec2Client ec2Client = awsHelper.createClient(account, "ec2-session-" + id,
                    creds -> Ec2Client.builder().region(region).credentialsProvider(creds).build());

            return ec2Client.describeInstances().reservations().stream()
                    .flatMap(r -> r.instances().stream())
                    .map(instance -> new Ec2InstanceDto(
                            instance.instanceId(),
                            instance.tags().stream()
                                    .filter(tag -> tag.key().equalsIgnoreCase("Name"))
                                    .findFirst().map(tag -> tag.value()).orElse("Unnamed"),
                            account.getRegion(),
                            instance.state().nameAsString()
                    ))
                    .toList();

        } catch (Exception e) {
            throw new RuntimeException("Error fetching EC2 instances", e);
        }
    }

    @Override
    public List<RdsInstanceDto> fetchRdsInstances(Long id) {
        try {
            Accounts account = awsHelper.getAccountOrThrow(id);
            Region region = awsHelper.getRegion(account);

            RdsClient rdsClient = awsHelper.createClient(account, "rds-session-" + id,
                    creds -> RdsClient.builder().region(region).credentialsProvider(creds).build());

            return rdsClient.describeDBInstances().dbInstances().stream()
                    .map(db -> new RdsInstanceDto(
                            db.dbInstanceIdentifier(),
                            db.tagList().stream()
                                    .filter(tag -> tag.key().equalsIgnoreCase("Name"))
                                    .findFirst()
                                    .map(tag -> tag.value())
                                    .orElse("Unnamed"),
                            account.getRegion(),
                            db.dbInstanceStatus()
                    ))
                    .toList();

        } catch (Exception e) {
            throw new RuntimeException("Error fetching RDS instances", e);
        }
    }

    @Override
    public List<AsgDto> fetchAutoScalingGroups(Long id) {
        try {
            Accounts account = awsHelper.getAccountOrThrow(id);
            Region region = awsHelper.getRegion(account);

            AutoScalingClient asgClient = awsHelper.createClient(account, "asg-session-" + id,
                    creds -> AutoScalingClient.builder().region(region).credentialsProvider(creds).build());

            return asgClient.describeAutoScalingGroups().autoScalingGroups().stream()
                    .map(group -> new AsgDto(
                            group.autoScalingGroupName(),
                            group.tags().stream()
                                    .filter(tag -> tag.key().equalsIgnoreCase("Name"))
                                    .findFirst()
                                    .map(tag -> tag.value())
                                    .orElse("Unnamed"),
                            account.getRegion(),
                            group.status() != null ? group.status() :
                                    (group.desiredCapacity() > 0 ? "Enabled" : "Disabled")
                    ))
                    .toList();

        } catch (Exception e) {
            throw new RuntimeException("Error fetching Auto Scaling Groups", e);
        }
    }



}
