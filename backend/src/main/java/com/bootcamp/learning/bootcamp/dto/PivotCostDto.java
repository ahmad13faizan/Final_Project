package com.bootcamp.learning.bootcamp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.LinkedHashMap;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PivotCostDto {
    private String groupValue;
    private Map<String, Double> monthToCost = new LinkedHashMap<>();
    // + constructors, getters, setters
}
