package com.bootcamp.learning.bootcamp.entity;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CostExplorerEntity {
    private String linkedAccountId;
    private int myCloudStartDay;
    private int myCloudStartMonth;
    private int myCloudStartYear;
    private String lineItemOperation;
    private String lineItemUsageType;
    private String myCloudInstanceType;
    private String myCloudOperatingSystem;
    private String myCloudPricingType;
    private String myCloudRegionName;
    private Timestamp usageStartDate;
    private String productDatabaseEngine;
    private String productProductName;
    private double lineItemUnblendedCost;
    private double lineItemUsageAmount;
    private String myCloudCostExplorerUsageGroupType;
    private String pricingUnit;
    private String chargeType;
    private String availabilityZone;
    private String tenancy;
}
