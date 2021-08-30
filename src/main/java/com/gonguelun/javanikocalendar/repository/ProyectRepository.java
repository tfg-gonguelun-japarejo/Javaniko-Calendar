package com.gonguelun.javanikocalendar.repository;

import com.gonguelun.javanikocalendar.domain.Proyect;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Proyect entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ProyectRepository extends JpaRepository<Proyect, Long> {}
