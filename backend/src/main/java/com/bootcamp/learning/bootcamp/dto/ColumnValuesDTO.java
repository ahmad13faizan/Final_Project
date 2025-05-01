// com/bootcamp/learning/bootcamp/dto/ColumnValuesDTO.java
package com.bootcamp.learning.bootcamp.dto;

import java.util.List;

public class ColumnValuesDTO {
    private String columnName;
    private List<String> values;

    public ColumnValuesDTO() {}

    public ColumnValuesDTO(String columnName, List<String> values) {
        this.columnName = columnName;
        this.values = values;
    }

    public String getColumnName() { return columnName; }
    public void setColumnName(String columnName) { this.columnName = columnName; }

    public List<String> getValues() { return values; }
    public void setValues(List<String> values) { this.values = values; }
}
