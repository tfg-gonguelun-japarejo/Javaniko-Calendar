package com.gonguelun.javanikocalendar.web.rest;

import com.gonguelun.javanikocalendar.domain.Proyect;
import com.gonguelun.javanikocalendar.repository.ProyectRepository;
import com.gonguelun.javanikocalendar.service.ProyectService;
import com.gonguelun.javanikocalendar.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.gonguelun.javanikocalendar.domain.Proyect}.
 */
@RestController
@RequestMapping("/api")
public class ProyectResource {

    private final Logger log = LoggerFactory.getLogger(ProyectResource.class);

    private static final String ENTITY_NAME = "proyect";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ProyectService proyectService;

    private final ProyectRepository proyectRepository;

    public ProyectResource(ProyectService proyectService, ProyectRepository proyectRepository) {
        this.proyectService = proyectService;
        this.proyectRepository = proyectRepository;
    }

    /**
     * {@code POST  /proyects} : Create a new proyect.
     *
     * @param proyect the proyect to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new proyect, or with status {@code 400 (Bad Request)} if the proyect has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/proyects")
    public ResponseEntity<Proyect> createProyect(@Valid @RequestBody Proyect proyect) throws URISyntaxException {
        log.debug("REST request to save Proyect : {}", proyect);
        if (proyect.getId() != null) {
            throw new BadRequestAlertException("A new proyect cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Proyect result = proyectService.save(proyect);
        return ResponseEntity
            .created(new URI("/api/proyects/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /proyects/:id} : Updates an existing proyect.
     *
     * @param id the id of the proyect to save.
     * @param proyect the proyect to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated proyect,
     * or with status {@code 400 (Bad Request)} if the proyect is not valid,
     * or with status {@code 500 (Internal Server Error)} if the proyect couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/proyects/{id}")
    public ResponseEntity<Proyect> updateProyect(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Proyect proyect
    ) throws URISyntaxException {
        log.debug("REST request to update Proyect : {}, {}", id, proyect);
        if (proyect.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, proyect.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!proyectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Proyect result = proyectService.save(proyect);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, proyect.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /proyects/:id} : Partial updates given fields of an existing proyect, field will ignore if it is null
     *
     * @param id the id of the proyect to save.
     * @param proyect the proyect to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated proyect,
     * or with status {@code 400 (Bad Request)} if the proyect is not valid,
     * or with status {@code 404 (Not Found)} if the proyect is not found,
     * or with status {@code 500 (Internal Server Error)} if the proyect couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/proyects/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Proyect> partialUpdateProyect(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Proyect proyect
    ) throws URISyntaxException {
        log.debug("REST request to partial update Proyect partially : {}, {}", id, proyect);
        if (proyect.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, proyect.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!proyectRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Proyect> result = proyectService.partialUpdate(proyect);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, proyect.getId().toString())
        );
    }

    /**
     * {@code GET  /proyects} : get all the proyects.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of proyects in body.
     */
    @GetMapping("/proyects")
    public List<Proyect> getAllProyects() {
        log.debug("REST request to get all Proyects");
        return proyectService.findAll();
    }

    /**
     * {@code GET  /proyects/:id} : get the "id" proyect.
     *
     * @param id the id of the proyect to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the proyect, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/proyects/{id}")
    public ResponseEntity<Proyect> getProyect(@PathVariable Long id) {
        log.debug("REST request to get Proyect : {}", id);
        Optional<Proyect> proyect = proyectService.findOne(id);
        return ResponseUtil.wrapOrNotFound(proyect);
    }

    /**
     * {@code DELETE  /proyects/:id} : delete the "id" proyect.
     *
     * @param id the id of the proyect to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/proyects/{id}")
    public ResponseEntity<Void> deleteProyect(@PathVariable Long id) {
        log.debug("REST request to delete Proyect : {}", id);
        proyectService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
