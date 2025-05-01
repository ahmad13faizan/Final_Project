package com.bootcamp.learning.bootcamp.repository;

import java.util.List;

public interface BaseRepository<T> {
    List<T> findAll();  // Retrieve all records
    T findById(String id);  // Retrieve a record by ID
    void save(T entity);  // Save a new record
    void delete(String id);  // Delete a record by ID
}
