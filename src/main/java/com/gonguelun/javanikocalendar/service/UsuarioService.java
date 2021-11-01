package com.gonguelun.javanikocalendar.service;

import com.gonguelun.javanikocalendar.domain.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Usuario}.
 */
public interface UsuarioService {
    /**
     * Save a usuario.
     *
     * @param usuario the entity to save.
     * @return the persisted entity.
     */
    Usuario save(Usuario usuario);

    /**
     * Partially updates a usuario.
     *
     * @param usuario the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Usuario> partialUpdate(Usuario usuario);

    /**
     * Get all the usuarios.
     *
     * @return the list of entities.
     */
    List<Usuario> findAll();

    /**
     * Get all the usuarios with eager load of many-to-many relationships.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Usuario> findAllWithEagerRelationships(Pageable pageable);

    /**
     * Get the "id" usuario.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Usuario> findOne(Long id);

    /**
     * Delete the "id" usuario.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);

    Optional<Usuario> findUsuarioByUsername(String username);
}
