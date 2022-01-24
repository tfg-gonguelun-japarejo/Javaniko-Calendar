package com.gonguelun.javanikocalendar.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gonguelun.javanikocalendar.IntegrationTest;
import com.gonguelun.javanikocalendar.domain.Proyect;
import com.gonguelun.javanikocalendar.repository.ProyectRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ProyectResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProyectResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAAAAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBBBBBBBBBBBB";

    private static final LocalDate DEFAULT_CREATED_AT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_CREATED_AT = LocalDate.now(ZoneId.systemDefault());

    private static final Boolean DEFAULT_IS_PRIVATE = false;
    private static final Boolean UPDATED_IS_PRIVATE = true;

    private static final String ENTITY_API_URL = "/api/proyects";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ProyectRepository proyectRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restProyectMockMvc;

    private Proyect proyect;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proyect createEntity(EntityManager em) {
        Proyect proyect = new Proyect()
            .name(DEFAULT_NAME)
            .description(DEFAULT_DESCRIPTION)
            .createdAt(DEFAULT_CREATED_AT)
            .isPrivate(DEFAULT_IS_PRIVATE);
        return proyect;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Proyect createUpdatedEntity(EntityManager em) {
        Proyect proyect = new Proyect()
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdAt(UPDATED_CREATED_AT)
            .isPrivate(UPDATED_IS_PRIVATE);
        return proyect;
    }

    @BeforeEach
    public void initTest() {
        proyect = createEntity(em);
    }

    @Test
    @Transactional
    void createProyect() throws Exception {
        int databaseSizeBeforeCreate = proyectRepository.findAll().size();
        // Create the Proyect
        restProyectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyect)))
            .andExpect(status().isCreated());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeCreate + 1);
        Proyect testProyect = proyectList.get(proyectList.size() - 1);
        assertThat(testProyect.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testProyect.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProyect.getCreatedAt()).isEqualTo(DEFAULT_CREATED_AT);
        assertThat(testProyect.getIsPrivate()).isEqualTo(DEFAULT_IS_PRIVATE);
    }

    @Test
    @Transactional
    void createProyectWithExistingId() throws Exception {
        // Create the Proyect with an existing ID
        proyect.setId(1L);

        int databaseSizeBeforeCreate = proyectRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProyectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyect)))
            .andExpect(status().isBadRequest());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = proyectRepository.findAll().size();
        // set the field null
        proyect.setName(null);

        // Create the Proyect, which fails.

        restProyectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyect)))
            .andExpect(status().isBadRequest());

        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = proyectRepository.findAll().size();
        // set the field null
        proyect.setDescription(null);

        // Create the Proyect, which fails.

        restProyectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyect)))
            .andExpect(status().isBadRequest());

        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkIsPrivateIsRequired() throws Exception {
        int databaseSizeBeforeTest = proyectRepository.findAll().size();
        // set the field null
        proyect.setIsPrivate(null);

        // Create the Proyect, which fails.

        restProyectMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyect)))
            .andExpect(status().isBadRequest());

        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllProyects() throws Exception {
        // Initialize the database
        proyectRepository.saveAndFlush(proyect);

        // Get all the proyectList
        restProyectMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(proyect.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].createdAt").value(hasItem(DEFAULT_CREATED_AT.toString())))
            .andExpect(jsonPath("$.[*].isPrivate").value(hasItem(DEFAULT_IS_PRIVATE.booleanValue())));
    }

    @Test
    @Transactional
    void getProyect() throws Exception {
        // Initialize the database
        proyectRepository.saveAndFlush(proyect);

        // Get the proyect
        restProyectMockMvc
            .perform(get(ENTITY_API_URL_ID, proyect.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(proyect.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.createdAt").value(DEFAULT_CREATED_AT.toString()))
            .andExpect(jsonPath("$.isPrivate").value(DEFAULT_IS_PRIVATE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingProyect() throws Exception {
        // Get the proyect
        restProyectMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewProyect() throws Exception {
        // Initialize the database
        proyectRepository.saveAndFlush(proyect);

        int databaseSizeBeforeUpdate = proyectRepository.findAll().size();

        // Update the proyect
        Proyect updatedProyect = proyectRepository.findById(proyect.getId()).get();
        // Disconnect from session so that the updates on updatedProyect are not directly saved in db
        em.detach(updatedProyect);
        updatedProyect.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).createdAt(UPDATED_CREATED_AT).isPrivate(UPDATED_IS_PRIVATE);

        restProyectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProyect.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProyect))
            )
            .andExpect(status().isOk());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeUpdate);
        Proyect testProyect = proyectList.get(proyectList.size() - 1);
        assertThat(testProyect.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProyect.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProyect.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testProyect.getIsPrivate()).isEqualTo(UPDATED_IS_PRIVATE);
    }

    @Test
    @Transactional
    void putNonExistingProyect() throws Exception {
        int databaseSizeBeforeUpdate = proyectRepository.findAll().size();
        proyect.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProyectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, proyect.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(proyect))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchProyect() throws Exception {
        int databaseSizeBeforeUpdate = proyectRepository.findAll().size();
        proyect.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProyectMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(proyect))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamProyect() throws Exception {
        int databaseSizeBeforeUpdate = proyectRepository.findAll().size();
        proyect.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProyectMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(proyect)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateProyectWithPatch() throws Exception {
        // Initialize the database
        proyectRepository.saveAndFlush(proyect);

        int databaseSizeBeforeUpdate = proyectRepository.findAll().size();

        // Update the proyect using partial update
        Proyect partialUpdatedProyect = new Proyect();
        partialUpdatedProyect.setId(proyect.getId());

        partialUpdatedProyect.name(UPDATED_NAME).createdAt(UPDATED_CREATED_AT);

        restProyectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProyect.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProyect))
            )
            .andExpect(status().isOk());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeUpdate);
        Proyect testProyect = proyectList.get(proyectList.size() - 1);
        assertThat(testProyect.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProyect.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testProyect.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testProyect.getIsPrivate()).isEqualTo(DEFAULT_IS_PRIVATE);
    }

    @Test
    @Transactional
    void fullUpdateProyectWithPatch() throws Exception {
        // Initialize the database
        proyectRepository.saveAndFlush(proyect);

        int databaseSizeBeforeUpdate = proyectRepository.findAll().size();

        // Update the proyect using partial update
        Proyect partialUpdatedProyect = new Proyect();
        partialUpdatedProyect.setId(proyect.getId());

        partialUpdatedProyect
            .name(UPDATED_NAME)
            .description(UPDATED_DESCRIPTION)
            .createdAt(UPDATED_CREATED_AT)
            .isPrivate(UPDATED_IS_PRIVATE);

        restProyectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProyect.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProyect))
            )
            .andExpect(status().isOk());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeUpdate);
        Proyect testProyect = proyectList.get(proyectList.size() - 1);
        assertThat(testProyect.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testProyect.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testProyect.getCreatedAt()).isEqualTo(UPDATED_CREATED_AT);
        assertThat(testProyect.getIsPrivate()).isEqualTo(UPDATED_IS_PRIVATE);
    }

    @Test
    @Transactional
    void patchNonExistingProyect() throws Exception {
        int databaseSizeBeforeUpdate = proyectRepository.findAll().size();
        proyect.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProyectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, proyect.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(proyect))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchProyect() throws Exception {
        int databaseSizeBeforeUpdate = proyectRepository.findAll().size();
        proyect.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProyectMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(proyect))
            )
            .andExpect(status().isBadRequest());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamProyect() throws Exception {
        int databaseSizeBeforeUpdate = proyectRepository.findAll().size();
        proyect.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProyectMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(proyect)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Proyect in the database
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteProyect() throws Exception {
        // Initialize the database
        proyectRepository.saveAndFlush(proyect);

        int databaseSizeBeforeDelete = proyectRepository.findAll().size();

        // Delete the proyect
        restProyectMockMvc
            .perform(delete(ENTITY_API_URL_ID, proyect.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Proyect> proyectList = proyectRepository.findAll();
        assertThat(proyectList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
