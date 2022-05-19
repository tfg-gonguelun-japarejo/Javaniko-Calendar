package com.gonguelun.javanikocalendar.repository;

import com.gonguelun.javanikocalendar.domain.Workspace;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Workspace entity.
 */
@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    @Query("select workspace from Workspace workspace join workspace.usuarios usuario where usuario.id = ?1")
    List<Workspace> findWorkspacesByUsuarioId(Long usuarioId);
}
