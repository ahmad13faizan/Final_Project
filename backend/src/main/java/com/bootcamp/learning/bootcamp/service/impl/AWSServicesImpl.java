// src/main/java/com/bootcamp/learning/bootcamp/service/Ec2Service.java
package com.bootcamp.learning.bootcamp.service.impl;

import com.bootcamp.learning.bootcamp.dto.Ec2InstanceDto;
import com.bootcamp.learning.bootcamp.entity.Accounts;
import com.bootcamp.learning.bootcamp.service.AWSServices;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsSessionCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.ec2.Ec2Client;
import software.amazon.awssdk.services.ec2.model.*;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;
import software.amazon.awssdk.services.sts.model.AssumeRoleResponse;

import java.util.ArrayList;
import java.util.List;

@Service
public class AWSServicesImpl implements AWSServices {

    public List<Ec2InstanceDto> fetchInstances(Accounts account) {
        // 1. Assume the IAM Role
        StsClient sts = StsClient.create();
        AssumeRoleResponse assumed = sts.assumeRole(AssumeRoleRequest.builder()
                .roleArn(account.getArn())
                .roleSessionName("session-" + account.getAccountId())
                .build());

        AwsSessionCredentials creds = AwsSessionCredentials.create(
                assumed.credentials().accessKeyId(),
                assumed.credentials().secretAccessKey(),
                assumed.credentials().sessionToken()
        );

        // 2. Build EC2 client in the account’s region
        Ec2Client ec2 = Ec2Client.builder()
                .region(Region.of(account.getRegion()))
                .credentialsProvider(StaticCredentialsProvider.create(creds))
                .build();

        // 3. Describe instances
        DescribeInstancesResponse resp = ec2.describeInstances();

        // 4. Map to DTOs
        List<Ec2InstanceDto> list = new ArrayList<>();
        for (Reservation r : resp.reservations()) {
            for (Instance i : r.instances()) {
                // find the “Name” tag if present
                String name = i.tags().stream()
                        .filter(t -> "Name".equals(t.key()))
                        .map(Tag::value)
                        .findFirst().orElse("");

                String status = i.state().nameAsString();

                list.add(new Ec2InstanceDto(
                        i.instanceId(),
                        name,
                        account.getRegion(),
                        status
                ));
            }
        }
        return list;
    }
}
