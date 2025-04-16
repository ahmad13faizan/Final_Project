package com.bootcamp.learning.bootcamp.service.impl;

import com.bootcamp.learning.bootcamp.dto.UserDTO;
import com.bootcamp.learning.bootcamp.entity.UserEntity;
import com.bootcamp.learning.bootcamp.repository.UserRepository;
import com.bootcamp.learning.bootcamp.service.UserService;
import com.bootcamp.learning.bootcamp.util.UserEntityToDTOMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserEntityToDTOMapping userEntityToDTOMapping;

    @Override
    public UserDTO createUser(UserDTO user) {
        UserEntity entity = userEntityToDTOMapping.map(user);
        userRepository.save(entity);
        user.setId(entity.getId());
        return user;
    }

    @Override
    public UserDTO getUser(Long id) {
        Optional<UserEntity> optionalEntity = userRepository.findById(id);
        return userEntityToDTOMapping.map(optionalEntity.get());
    }
}
