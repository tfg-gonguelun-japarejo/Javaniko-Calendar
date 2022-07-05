package com.gonguelun.javanikocalendar.service;

import com.gonguelun.javanikocalendar.domain.Sprint;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Sprint}.
 */
public interface SprintService {
    /**
     * Save a sprint.
     *
     * @param sprint the entity to save.
     * @return the persisted entity.
     */
    Sprint save(Sprint sprint);

    /**
     * Partially updates a sprint.
     *
     * @param sprint the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Sprint> partialUpdate(Sprint sprint);

    /**
     * Get all the sprints.
     *
     * @return the list of entities.
     */
    List<Sprint> findAll();

    /**
     * Get the "id" sprint.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Sprint> findOne(Long id);

    /**
     * Delete the "id" sprint.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    List<Sprint> findSprintsByProyectId(Long proyectId);
}
