// com/bootcamp/learning/bootcamp/dto/ColumnNamesDTO.java
package com.bootcamp.learning.bootcamp.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ColumnNamesDTO {
    private List<String> columnNames;
}