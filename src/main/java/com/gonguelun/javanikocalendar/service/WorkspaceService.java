package com.gonguelun.javanikocalendar.service;

import com.gonguelun.javanikocalendar.domain.Workspace;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Workspace}.
 */
public interface WorkspaceService {
    /**
     * Save a workspace.
     *
     * @param workspace the entity to save.
     * @return the persisted entity.
     */
    Workspace save(Workspace workspace);

    /**
     * Partially updates a workspace.
     *
     * @param workspace the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Workspace> partialUpdate(Workspace workspace);

    /**
     * Get all the workspaces.
     *
     * @return the list of entities.
     */
    List<Workspace> findAll();

    /**
     * Get the "id" workspace.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Workspace> findOne(Long id);

    /**
     * Delete the "id" workspace.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
