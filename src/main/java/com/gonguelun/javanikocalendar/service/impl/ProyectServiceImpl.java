package com.gonguelun.javanikocalendar.service.impl;

import com.gonguelun.javanikocalendar.domain.Proyect;
import com.gonguelun.javanikocalendar.repository.ProyectRepository;
import com.gonguelun.javanikocalendar.service.ProyectService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Proyect}.
 */
@Service
@Transactional
public class ProyectServiceImpl implements ProyectService {

    private final Logger log = LoggerFactory.getLogger(ProyectServiceImpl.class);

    private final ProyectRepository proyectRepository;

    public ProyectServiceImpl(ProyectRepository proyectRepository) {
        this.proyectRepository = proyectRepository;
    }

    @Override
    public Proyect save(Proyect proyect) {
        log.debug("Request to save Proyect : {}", proyect);
        return proyectRepository.save(proyect);
    }

    @Override
    public Optional<Proyect> partialUpdate(Proyect proyect) {
        log.debug("Request to partially update Proyect : {}", proyect);

        return proyectRepository
            .findById(proyect.getId())
            .map(
                existingProyect -> {
                    if (proyect.getName() != null) {
                        existingProyect.setName(proyect.getName());
                    }
                    if (proyect.getDescription() != null) {
                        existingProyect.setDescription(proyect.getDescription());
                    }
                    if (proyect.getCreatedAt() != null) {
                        existingProyect.setCreatedAt(proyect.getCreatedAt());
                    }
                    if (proyect.getIsPrivate() != null) {
                        existingProyect.setIsPrivate(proyect.getIsPrivate());
                    }
                    if (proyect.getMilestonesUrl() != null) {
                        existingProyect.setMilestonesUrl(proyect.getMilestonesUrl());
                    }

                    return existingProyect;
                }
            )
            .map(proyectRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Proyect> findAll() {
        log.debug("Request to get all Proyects");
        return proyectRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Proyect> findOne(Long id) {
        log.debug("Request to get Proyect : {}", id);
        return proyectRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Proyect : {}", id);
        proyectRepository.deleteById(id);
    }

    @Override
    public List<Proyect> findProyectsByUsuarioId(Long usuarioId) {
        return proyectRepository.findProyectsByUsuarioId(usuarioId);
    }
}
