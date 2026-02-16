package com.policourt.api.user.infrastructure.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.policourt.api.user.infrastructure.entity.UserEntity;

public interface UserJpaRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity> {
    UserEntity findByEmail(String email);

    UserEntity findByUsername(String username);

    UserEntity save(UserEntity userEntity);

}