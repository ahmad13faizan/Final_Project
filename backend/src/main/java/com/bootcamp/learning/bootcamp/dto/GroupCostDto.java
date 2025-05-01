package com.bootcamp.learning.bootcamp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@AllArgsConstructor
@RequiredArgsConstructor
public class GroupCostDto {
    String grp;   // the value of the GROUP-BY column
    int    year;         // MYCLOUD_STARTYEAR
    int    month;        // MYCLOUD_STARTMONTH
    double total_cost;    // SUM(usage×unitCost)

//    public GroupCostDto(int year, int month) {
//        this.year = year;
//        this.month = month;
//    }
}
