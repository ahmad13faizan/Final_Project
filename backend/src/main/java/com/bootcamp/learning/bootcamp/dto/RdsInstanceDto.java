package com.bootcamp.learning.bootcamp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class RdsInstanceDto {
    private String id;
    private String name;
    private String region;
    private String status;
}
