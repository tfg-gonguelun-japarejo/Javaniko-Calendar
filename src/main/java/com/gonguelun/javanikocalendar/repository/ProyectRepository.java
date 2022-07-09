package com.gonguelun.javanikocalendar.repository;

import com.gonguelun.javanikocalendar.domain.Proyect;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Proyect entity.
 */
@Repository
public interface ProyectRepository extends JpaRepository<Proyect, Long> {
    @Query("select proyect from Proyect proyect join proyect.usuarios usuario where usuario.id = ?1")
    List<Proyect> findProyectsByUsuarioId(Long usuarioId);
}
