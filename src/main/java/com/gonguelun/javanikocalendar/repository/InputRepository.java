package com.gonguelun.javanikocalendar.repository;

import com.gonguelun.javanikocalendar.domain.Input;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Input entity.
 */
@Repository
public interface InputRepository extends JpaRepository<Input, Long> {
    @Query("select i from Input i inner join i.usuario u where u.username = ?1")
    List<Input> findAllInputsByUsername(String username);

    @Query("select i from Input i inner join i.usuario u where u.username = ?1 and i.inputDate >= ?2 and i.inputDate <= ?3")
    List<Input> findAllInputsByUsernameAndDate(String username, LocalDate inputDate, LocalDate dueDate);

    @Query("select i from Input i inner join i.sprint s where s.id = ?1 and i.inputDate >= ?2 and i.inputDate <= ?3")
    List<Input> findAllInputsBySprintIdAndDate(Long sprintId, LocalDate inputDate, LocalDate dueDate);
}
