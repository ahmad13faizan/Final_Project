package com.bootcamp.learning.bootcamp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@AllArgsConstructor
@Data
public class RdsInstanceDto {
    private String identifier;
    private String instanceClass;
    private String status;
    private String endpoint;
}
