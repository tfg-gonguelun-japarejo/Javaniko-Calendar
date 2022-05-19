package com.gonguelun.javanikocalendar.service.impl;

import com.gonguelun.javanikocalendar.domain.Workspace;
import com.gonguelun.javanikocalendar.repository.WorkspaceRepository;
import com.gonguelun.javanikocalendar.service.WorkspaceService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Workspace}.
 */
@Service
@Transactional
public class WorkspaceServiceImpl implements WorkspaceService {

    private final Logger log = LoggerFactory.getLogger(WorkspaceServiceImpl.class);

    private final WorkspaceRepository workspaceRepository;

    public WorkspaceServiceImpl(WorkspaceRepository workspaceRepository) {
        this.workspaceRepository = workspaceRepository;
    }

    @Override
    public Workspace save(Workspace workspace) {
        log.debug("Request to save Workspace : {}", workspace);
        return workspaceRepository.save(workspace);
    }

    @Override
    public Optional<Workspace> partialUpdate(Workspace workspace) {
        log.debug("Request to partially update Workspace : {}", workspace);

        return workspaceRepository
            .findById(workspace.getId())
            .map(
                existingWorkspace -> {
                    if (workspace.getLogin() != null) {
                        existingWorkspace.setLogin(workspace.getLogin());
                    }
                    if (workspace.getrepos_url() != null) {
                        existingWorkspace.setrepos_url(workspace.getrepos_url());
                    }
                    if (workspace.getDescription() != null) {
                        existingWorkspace.setDescription(workspace.getDescription());
                    }

                    return existingWorkspace;
                }
            )
            .map(workspaceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Workspace> findAll() {
        log.debug("Request to get all Workspaces");
        return workspaceRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Workspace> findOne(Long id) {
        log.debug("Request to get Workspace : {}", id);
        return workspaceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Workspace : {}", id);
        workspaceRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Workspace> findWorkspacesByUsuarioId(Long usuarioId) {
        log.debug("Request to get all Workspaces by Usuario");
        return workspaceRepository.findWorkspacesByUsuarioId(usuarioId);
    }
}
