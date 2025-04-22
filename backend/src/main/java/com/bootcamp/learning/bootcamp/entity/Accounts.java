package com.bootcamp.learning.bootcamp.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "accounts")
public class Accounts {

    @Id
    @Column(nullable = false)
    private Long AccountId;

    @Column(nullable = false)
    private String arn;

    @Column(nullable = false)
    private String AccountName;

    @Builder.Default
    private Boolean isOrphan=true;

    @Column(nullable = false)
    private String region;

}
