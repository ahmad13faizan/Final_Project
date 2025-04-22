// src/main/java/com/bootcamp/learning/bootcamp/service/Ec2Service.java
package com.bootcamp.learning.bootcamp.service.impl;

import com.bootcamp.learning.bootcamp.dto.AsgDto;
import com.bootcamp.learning.bootcamp.dto.Ec2InstanceDto;
import com.bootcamp.learning.bootcamp.dto.RdsInstanceDto;
import com.bootcamp.learning.bootcamp.entity.Accounts;
import com.bootcamp.learning.bootcamp.repository.AccountsRepository;
import com.bootcamp.learning.bootcamp.service.AWSServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.ProfileCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.autoscaling.AutoScalingClient;
import software.amazon.awssdk.services.autoscaling.model.DescribeAutoScalingGroupsResponse;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.*;
import software.amazon.awssdk.services.rds.RdsClient;
import software.amazon.awssdk.services.rds.model.DescribeDbInstancesResponse;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;
import software.amazon.awssdk.services.sts.model.AssumeRoleResponse;

import java.util.ArrayList;
import java.util.List;

@Service
public class AWSServicesImpl implements AWSServices {

    @Autowired
    AccountsRepository accountsRepository;

    public List<AsgDto> fetchAutoScalingGroups(Long id) {
        try {
            Accounts account = accountsRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            AwsCredentialsProvider baseCredentials = ProfileCredentialsProvider.create();

            StsClient stsClient = StsClient.builder()
                    .region(Region.of(account.getRegion()))
                    .credentialsProvider(baseCredentials)
                    .build();

            AssumeRoleResponse assumeRole = stsClient.assumeRole(AssumeRoleRequest.builder()
                    .roleArn(account.getArn())
                    .roleSessionName("asg-session-" + id)
                    .build());

            AwsSessionCredentials tempCreds = AwsSessionCredentials.create(
                    assumeRole.credentials().accessKeyId(),
                    assumeRole.credentials().secretAccessKey(),
                    assumeRole.credentials().sessionToken()
            );

            AutoScalingClient asgClient = AutoScalingClient.builder()
                    .region(Region.of(account.getRegion()))
                    .credentialsProvider(StaticCredentialsProvider.create(tempCreds))
                    .build();

            DescribeAutoScalingGroupsResponse response = asgClient.describeAutoScalingGroups();

            return response.autoScalingGroups().stream()
                    .map(group -> new AsgDto(
                            group.autoScalingGroupName(),
                            group.desiredCapacity(),
                            group.minSize(),
                            group.maxSize()
                    )).toList();

        } catch (Exception e) {
            throw new RuntimeException("Error fetching Auto Scaling Groups: " + e.getMessage(), e);
        }
    }


    public List<RdsInstanceDto> fetchRdsInstances(Long id) {
        try {
            Accounts account = accountsRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found"));

            AwsCredentialsProvider baseCredentials = ProfileCredentialsProvider.create();

            StsClient stsClient = StsClient.builder()
                    .region(Region.of(account.getRegion()))
                    .credentialsProvider(baseCredentials)
                    .build();

            AssumeRoleResponse assumeRole = stsClient.assumeRole(AssumeRoleRequest.builder()
                    .roleArn(account.getArn())
                    .roleSessionName("rds-session-" + id)
                    .build());

            AwsSessionCredentials tempCreds = AwsSessionCredentials.create(
                    assumeRole.credentials().accessKeyId(),
                    assumeRole.credentials().secretAccessKey(),
                    assumeRole.credentials().sessionToken()
            );

            RdsClient rdsClient = RdsClient.builder()
                    .region(Region.of(account.getRegion()))
                    .credentialsProvider(StaticCredentialsProvider.create(tempCreds))
                    .build();

            DescribeDbInstancesResponse response = rdsClient.describeDBInstances();

            return response.dbInstances().stream()
                    .map(db -> new RdsInstanceDto(
                            db.dbInstanceIdentifier(),
                            db.dbInstanceClass(),
                            db.dbInstanceStatus(),
                            db.endpoint().address()
                    )).toList();

        } catch (Exception e) {
            throw new RuntimeException("Error fetching RDS instances: " + e.getMessage(), e);
        }
    }


    public List<Ec2InstanceDto> fetchInstances(Long id) {
        try {
            Accounts account = accountsRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));

            // Use default profile from ~/.aws/credentials
            AwsCredentialsProvider baseCredentials = ProfileCredentialsProvider.create();

            // STS assume role
            StsClient stsClient = StsClient.builder()
                    .region(Region.of(account.getRegion()))
                    .credentialsProvider(baseCredentials)
                    .build();

            AssumeRoleRequest assumeRoleRequest = AssumeRoleRequest.builder()
                    .roleArn(account.getArn())
                    .roleSessionName("session-" + id)
                    .build();

                AssumeRoleResponse assumeRoleResponse = stsClient.assumeRole(assumeRoleRequest);

            AwsSessionCredentials tempCreds = AwsSessionCredentials.create(
                    assumeRoleResponse.credentials().accessKeyId(),
                    assumeRoleResponse.credentials().secretAccessKey(),
                    assumeRoleResponse.credentials().sessionToken()
            );

            Ec2Client ec2Client = Ec2Client.builder()
                    .region(Region.of(account.getRegion()))
                    .credentialsProvider(StaticCredentialsProvider.create(tempCreds))
                    .build();

            DescribeInstancesResponse response = ec2Client.describeInstances();

            List<Ec2InstanceDto> dtos = new ArrayList<>();
            for (Reservation reservation : response.reservations()) {
                for (Instance instance : reservation.instances()) {
                    dtos.add(new Ec2InstanceDto(
                            instance.instanceId(),
                            instance.tags().stream()
                                    .filter(tag -> tag.key().equalsIgnoreCase("Name"))
                                    .findFirst().map(Tag::value).orElse("Unnamed"),
                            account.getRegion(),
                            instance.state().nameAsString()
                    ));
                }
            }

            return dtos;

        } catch (Exception e) {
            // Log and rethrow if needed, or return empty list/fallback
            System.err.println("Failed to fetch EC2 instances: " + e.getMessage());
            throw new RuntimeException("Error fetching EC2 instances", e);
        }
    }

}
