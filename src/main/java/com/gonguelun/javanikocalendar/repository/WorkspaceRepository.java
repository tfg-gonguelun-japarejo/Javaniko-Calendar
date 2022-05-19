package com.gonguelun.javanikocalendar.repository;

import com.gonguelun.javanikocalendar.domain.Workspace;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Workspace entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {}
