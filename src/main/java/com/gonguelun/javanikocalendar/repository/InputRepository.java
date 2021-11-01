package com.gonguelun.javanikocalendar.repository;

import java.util.List;

import com.gonguelun.javanikocalendar.domain.Input;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Input entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InputRepository extends JpaRepository<Input, Long> {
    @Query("select i from Input i inner join i.usuario u where u.username = ?1")
    List<Input> findAllInputsByUsername(String username);
}
    