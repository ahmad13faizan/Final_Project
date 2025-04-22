package com.bootcamp.learning.bootcamp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class AsgDto {
    private String groupName;
    private int desiredCapacity;
    private int minSize;
    private int maxSize;
}
