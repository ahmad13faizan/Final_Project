package com.bootcamp.learning.bootcamp.repository;

import com.bootcamp.learning.bootcamp.entity.LoginToken;
import com.bootcamp.learning.bootcamp.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface LoginTokenRepository extends JpaRepository<LoginToken, Long> {
    Optional<LoginToken> findByToken(String token);

    Optional<LoginToken> findByUser(User user);

    void deleteAllByCreatedAtBefore(LocalDateTime time);

    void deleteByUser(User user);

}
