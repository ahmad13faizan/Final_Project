package com.bootcamp.learning.bootcamp.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class ColumnNotFoundException extends RuntimeException {
    public ColumnNotFoundException(String column) {
        super("Column not found: " + column);
    }
}
