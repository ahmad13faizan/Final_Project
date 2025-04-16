package com.bootcamp.learning.bootcamp.util;

import com.bootcamp.learning.bootcamp.dto.UserDTO;
import com.bootcamp.learning.bootcamp.entity.UserEntity;

public class UserEntityToDTOMapping {


    public UserDTO map(UserEntity entity){
        UserDTO dto = new UserDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setEmail(entity.getEmail());
        return dto;
    }

    public UserEntity map(UserDTO dto){
        UserEntity entity = new UserEntity();
        entity.setEmail(dto.getEmail());
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        return entity;
    }
}
