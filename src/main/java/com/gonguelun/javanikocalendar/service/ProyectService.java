package com.gonguelun.javanikocalendar.service;

import com.gonguelun.javanikocalendar.domain.Proyect;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Proyect}.
 */
public interface ProyectService {
    /**
     * Save a proyect.
     *
     * @param proyect the entity to save.
     * @return the persisted entity.
     */
    Proyect save(Proyect proyect);

    /**
     * Partially updates a proyect.
     *
     * @param proyect the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Proyect> partialUpdate(Proyect proyect);

    /**
     * Get all the proyects.
     *
     * @return the list of entities.
     */
    List<Proyect> findAll();

    /**
     * Get the "id" proyect.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Proyect> findOne(Long id);

    /**
     * Delete the "id" proyect.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
