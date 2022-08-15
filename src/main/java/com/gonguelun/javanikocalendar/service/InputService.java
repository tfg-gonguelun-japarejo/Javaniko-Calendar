package com.gonguelun.javanikocalendar.service;

import com.gonguelun.javanikocalendar.domain.Input;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Input}.
 */
public interface InputService {
    /**
     * Save a input.
     *
     * @param input the entity to save.
     * @return the persisted entity.
     */
    Input save(Input input);

    /**
     * Partially updates a input.
     *
     * @param input the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Input> partialUpdate(Input input);

    /**
     * Get all the inputs.
     *
     * @return the list of entities.
     */
    List<Input> findAll();

    /**
     * Get the "id" input.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Input> findOne(Long id);

    /**
     * Delete the "id" input.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    List<Input> findAllInputsByUsername(String username);

    List<Input> findAllInputsByUsernameAndDate(String username, LocalDate inputDate, LocalDate dueDate);

    List<Input> findAllInputsBySprintIdAndDate(Long sprintId, LocalDate inputDate, LocalDate dueDate);
}
