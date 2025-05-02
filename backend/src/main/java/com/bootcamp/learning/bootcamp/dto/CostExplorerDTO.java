package com.bootcamp.learning.bootcamp.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CostExplorerDTO {
    private String linkedAccountId;
    private int startDay;
    private int startMonth;
    private int startYear;
    private String operation;
    private String usageType;
    private String instanceType;
    private String operatingSystem;
    private String pricingType;
    private String regionName;
    private Timestamp usageStartDate;
    private String databaseEngine;
    private String productName;
    private double unblendedCost;
    private double usageAmount;
    private String usageGroupType;
    private String pricingUnit;
    private String chargeType;
    private String availabilityZone;
    private String tenancy;
}
