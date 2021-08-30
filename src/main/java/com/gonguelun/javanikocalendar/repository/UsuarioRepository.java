package com.gonguelun.javanikocalendar.repository;

import com.gonguelun.javanikocalendar.domain.Usuario;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Usuario entity.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    @Query(
        value = "select distinct usuario from Usuario usuario left join fetch usuario.workspaces left join fetch usuario.proyects",
        countQuery = "select count(distinct usuario) from Usuario usuario"
    )
    Page<Usuario> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct usuario from Usuario usuario left join fetch usuario.workspaces left join fetch usuario.proyects")
    List<Usuario> findAllWithEagerRelationships();

    @Query("select usuario from Usuario usuario left join fetch usuario.workspaces left join fetch usuario.proyects where usuario.id =:id")
    Optional<Usuario> findOneWithEagerRelationships(@Param("id") Long id);
}
