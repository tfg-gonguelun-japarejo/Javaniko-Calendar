package com.gonguelun.javanikocalendar.repository;

import com.gonguelun.javanikocalendar.domain.Input;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Input entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InputRepository extends JpaRepository<Input, Long> {}
