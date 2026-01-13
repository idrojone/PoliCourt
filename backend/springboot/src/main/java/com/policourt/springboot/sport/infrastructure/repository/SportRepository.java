package com.policourt.springboot.sport.infrastructure.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.policourt.springboot.sport.domain.entity.Sport;

@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
    Optional<Sport> findByName(String name);

    boolean existsByName(String name);

}
