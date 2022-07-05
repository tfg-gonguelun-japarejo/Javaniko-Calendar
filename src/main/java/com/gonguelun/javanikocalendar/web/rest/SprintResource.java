package com.gonguelun.javanikocalendar.web.rest;

import com.gonguelun.javanikocalendar.domain.Sprint;
import com.gonguelun.javanikocalendar.repository.SprintRepository;
import com.gonguelun.javanikocalendar.service.SprintService;
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
 * REST controller for managing {@link com.gonguelun.javanikocalendar.domain.Sprint}.
 */
@RestController
@RequestMapping("/api")
public class SprintResource {

    private final Logger log = LoggerFactory.getLogger(SprintResource.class);

    private static final String ENTITY_NAME = "sprint";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SprintService sprintService;

    private final SprintRepository sprintRepository;

    public SprintResource(SprintService sprintService, SprintRepository sprintRepository) {
        this.sprintService = sprintService;
        this.sprintRepository = sprintRepository;
    }

    /**
     * {@code POST  /sprints} : Create a new sprint.
     *
     * @param sprint the sprint to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new sprint, or with status {@code 400 (Bad Request)} if the sprint has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/sprints")
    public ResponseEntity<Sprint> createSprint(@Valid @RequestBody Sprint sprint) throws URISyntaxException {
        log.debug("REST request to save Sprint : {}", sprint);
        if (sprint.getId() != null) {
            throw new BadRequestAlertException("A new sprint cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Sprint result = sprintService.save(sprint);
        return ResponseEntity
            .created(new URI("/api/sprints/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /sprints/:id} : Updates an existing sprint.
     *
     * @param id the id of the sprint to save.
     * @param sprint the sprint to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sprint,
     * or with status {@code 400 (Bad Request)} if the sprint is not valid,
     * or with status {@code 500 (Internal Server Error)} if the sprint couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/sprints/{id}")
    public ResponseEntity<Sprint> updateSprint(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Sprint sprint
    ) throws URISyntaxException {
        log.debug("REST request to update Sprint : {}, {}", id, sprint);
        if (sprint.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sprint.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sprintRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Sprint result = sprintService.save(sprint);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sprint.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /sprints/:id} : Partial updates given fields of an existing sprint, field will ignore if it is null
     *
     * @param id the id of the sprint to save.
     * @param sprint the sprint to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated sprint,
     * or with status {@code 400 (Bad Request)} if the sprint is not valid,
     * or with status {@code 404 (Not Found)} if the sprint is not found,
     * or with status {@code 500 (Internal Server Error)} if the sprint couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/sprints/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Sprint> partialUpdateSprint(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Sprint sprint
    ) throws URISyntaxException {
        log.debug("REST request to partial update Sprint partially : {}, {}", id, sprint);
        if (sprint.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, sprint.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!sprintRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Sprint> result = sprintService.partialUpdate(sprint);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, sprint.getId().toString())
        );
    }

    /**
     * {@code GET  /sprints} : get all the sprints.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of sprints in body.
     */
    @GetMapping("/sprints")
    public List<Sprint> getAllSprints() {
        log.debug("REST request to get all Sprints");
        return sprintService.findAll();
    }

    /**
     * {@code GET  /sprints/:id} : get the "id" sprint.
     *
     * @param id the id of the sprint to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the sprint, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/sprints/{id}")
    public ResponseEntity<Sprint> getSprint(@PathVariable Long id) {
        log.debug("REST request to get Sprint : {}", id);
        Optional<Sprint> sprint = sprintService.findOne(id);
        return ResponseUtil.wrapOrNotFound(sprint);
    }

    /**
     * {@code DELETE  /sprints/:id} : delete the "id" sprint.
     *
     * @param id the id of the sprint to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/sprints/{id}")
    public ResponseEntity<Void> deleteSprint(@PathVariable Long id) {
        log.debug("REST request to delete Sprint : {}", id);
        sprintService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/sprints/proyect")
    public List<Sprint> findSprintsByProyectId(@RequestParam(value = "proyectId") Long proyectId) {
        log.debug("REST request to get Proyects by Usuario");
        List<Sprint> sprints = sprintService.findSprintsByProyectId(proyectId);
        return sprints;
    }
}
