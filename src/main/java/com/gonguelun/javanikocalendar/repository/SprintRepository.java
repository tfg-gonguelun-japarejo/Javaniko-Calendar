package com.gonguelun.javanikocalendar.repository;

import com.gonguelun.javanikocalendar.domain.Sprint;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Sprint entity.
 */
@Repository
public interface SprintRepository extends JpaRepository<Sprint, Long> {
    @Query("select sprint from Sprint sprint where sprint.proyect.id = ?1")
    List<Sprint> findSprintsByProyectId(Long proyectId);
}
