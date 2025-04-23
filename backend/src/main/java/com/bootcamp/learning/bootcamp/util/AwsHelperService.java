package com.bootcamp.learning.bootcamp.util;

import com.bootcamp.learning.bootcamp.entity.Accounts;
import com.bootcamp.learning.bootcamp.repository.AccountsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.*;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sts.StsClient;
import software.amazon.awssdk.services.sts.model.AssumeRoleRequest;
import software.amazon.awssdk.services.sts.model.AssumeRoleResponse;

import java.util.function.Function;

@Service
public class AwsHelperService {

    @Autowired
    private AccountsRepository accountsRepository;

    private final AwsCredentialsProvider baseCredentials = ProfileCredentialsProvider.create();

    public Accounts getAccountOrThrow(Long id) {
        return accountsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found with ID: " + id));
    }

    public StaticCredentialsProvider assumeRole(Accounts account, String sessionName) {
        StsClient stsClient = StsClient.builder()
                .region(Region.of(account.getRegion()))
                .credentialsProvider(baseCredentials)
                .build();

        AssumeRoleRequest request = AssumeRoleRequest.builder()
                .roleArn(account.getArn())
                .roleSessionName(sessionName)
                .build();

        AssumeRoleResponse response = stsClient.assumeRole(request);

        AwsSessionCredentials tempCreds = AwsSessionCredentials.create(
                response.credentials().accessKeyId(),
                response.credentials().secretAccessKey(),
                response.credentials().sessionToken()
        );

        return StaticCredentialsProvider.create(tempCreds);
    }

    public <T> T createClient(Accounts account, String sessionName, Function<StaticCredentialsProvider, T> builderFunction) {
        StaticCredentialsProvider creds = assumeRole(account, sessionName);
        return builderFunction.apply(creds);
    }

    public Region getRegion(Accounts account) {
        return Region.of(account.getRegion());
    }
}

