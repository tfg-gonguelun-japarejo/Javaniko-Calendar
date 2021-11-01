package com.gonguelun.javanikocalendar.web.rest;

import com.gonguelun.javanikocalendar.domain.Input;
import com.gonguelun.javanikocalendar.repository.InputRepository;
import com.gonguelun.javanikocalendar.security.SecurityUtils;
import com.gonguelun.javanikocalendar.service.InputService;
import com.gonguelun.javanikocalendar.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
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
 * REST controller for managing {@link com.gonguelun.javanikocalendar.domain.Input}.
 */
@RestController
@RequestMapping("/api")
public class InputResource {

    private final Logger log = LoggerFactory.getLogger(InputResource.class);

    private static final String ENTITY_NAME = "input";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InputService inputService;

    private final InputRepository inputRepository;

    public InputResource(InputService inputService, InputRepository inputRepository) {
        this.inputService = inputService;
        this.inputRepository = inputRepository;
    }

    /**
     * {@code POST  /inputs} : Create a new input.
     *
     * @param input the input to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new input, or with status {@code 400 (Bad Request)} if the input has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/inputs")
    public ResponseEntity<Input> createInput(@Valid @RequestBody Input input) throws URISyntaxException {
        log.debug("REST request to save Input : {}", input);
        if (input.getId() != null) {
            throw new BadRequestAlertException("A new input cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Input result = inputService.save(input);
        return ResponseEntity
            .created(new URI("/api/inputs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /inputs/:id} : Updates an existing input.
     *
     * @param id the id of the input to save.
     * @param input the input to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated input,
     * or with status {@code 400 (Bad Request)} if the input is not valid,
     * or with status {@code 500 (Internal Server Error)} if the input couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/inputs/{id}")
    public ResponseEntity<Input> updateInput(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Input input)
        throws URISyntaxException {
        log.debug("REST request to update Input : {}, {}", id, input);
        if (input.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, input.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inputRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Input result = inputService.save(input);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, input.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /inputs/:id} : Partial updates given fields of an existing input, field will ignore if it is null
     *
     * @param id the id of the input to save.
     * @param input the input to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated input,
     * or with status {@code 400 (Bad Request)} if the input is not valid,
     * or with status {@code 404 (Not Found)} if the input is not found,
     * or with status {@code 500 (Internal Server Error)} if the input couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/inputs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Input> partialUpdateInput(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Input input
    ) throws URISyntaxException {
        log.debug("REST request to partial update Input partially : {}, {}", id, input);
        if (input.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, input.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!inputRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Input> result = inputService.partialUpdate(input);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, input.getId().toString())
        );
    }

    /**
     * {@code GET  /inputs} : get all the inputs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of inputs in body.
     */
    @GetMapping("/inputs")
    public List<Input> getAllInputs() {
        String username = SecurityUtils.getCurrentUserLogin().orElse(null);
        List<Input> res = new ArrayList<>();
        log.debug("REST request to get all Inputs");
        if(!username.equals("admin")) {
            res = inputService.findAllInputsByUsername(username);
        } else {
            res = inputService.findAll();
        }

        return res;
        
    }

    /**
     * {@code GET  /inputs/:id} : get the "id" input.
     *
     * @param id the id of the input to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the input, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/inputs/{id}")
    public ResponseEntity<Input> getInput(@PathVariable Long id) {
        log.debug("REST request to get Input : {}", id);
        Optional<Input> input = inputService.findOne(id);
        return ResponseUtil.wrapOrNotFound(input);
    }

    /**
     * {@code DELETE  /inputs/:id} : delete the "id" input.
     *
     * @param id the id of the input to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/inputs/{id}")
    public ResponseEntity<Void> deleteInput(@PathVariable Long id) {
        log.debug("REST request to delete Input : {}", id);
        inputService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
