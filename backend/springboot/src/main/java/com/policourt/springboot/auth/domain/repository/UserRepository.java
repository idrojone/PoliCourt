package com.policourt.springboot.auth.domain.repository;

import com.policourt.springboot.auth.domain.model.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    User save(User user);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    void deleteById(UUID id);
    List<User> findAll();
    List<User> searchByUsername(String username);
}
