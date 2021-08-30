package com.gonguelun.javanikocalendar.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gonguelun.javanikocalendar.IntegrationTest;
import com.gonguelun.javanikocalendar.domain.Input;
import com.gonguelun.javanikocalendar.repository.InputRepository;
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
 * Integration tests for the {@link InputResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InputResourceIT {

    private static final String DEFAULT_COMMENT = "AAAAAAAAAA";
    private static final String UPDATED_COMMENT = "BBBBBBBBBB";

    private static final Integer DEFAULT_FEELINGS = 1;
    private static final Integer UPDATED_FEELINGS = 2;

    private static final LocalDate DEFAULT_INPUT_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_INPUT_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/inputs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InputRepository inputRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInputMockMvc;

    private Input input;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Input createEntity(EntityManager em) {
        Input input = new Input().comment(DEFAULT_COMMENT).feelings(DEFAULT_FEELINGS).inputDate(DEFAULT_INPUT_DATE);
        return input;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Input createUpdatedEntity(EntityManager em) {
        Input input = new Input().comment(UPDATED_COMMENT).feelings(UPDATED_FEELINGS).inputDate(UPDATED_INPUT_DATE);
        return input;
    }

    @BeforeEach
    public void initTest() {
        input = createEntity(em);
    }

    @Test
    @Transactional
    void createInput() throws Exception {
        int databaseSizeBeforeCreate = inputRepository.findAll().size();
        // Create the Input
        restInputMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(input)))
            .andExpect(status().isCreated());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeCreate + 1);
        Input testInput = inputList.get(inputList.size() - 1);
        assertThat(testInput.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testInput.getFeelings()).isEqualTo(DEFAULT_FEELINGS);
        assertThat(testInput.getInputDate()).isEqualTo(DEFAULT_INPUT_DATE);
    }

    @Test
    @Transactional
    void createInputWithExistingId() throws Exception {
        // Create the Input with an existing ID
        input.setId(1L);

        int databaseSizeBeforeCreate = inputRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInputMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(input)))
            .andExpect(status().isBadRequest());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFeelingsIsRequired() throws Exception {
        int databaseSizeBeforeTest = inputRepository.findAll().size();
        // set the field null
        input.setFeelings(null);

        // Create the Input, which fails.

        restInputMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(input)))
            .andExpect(status().isBadRequest());

        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkInputDateIsRequired() throws Exception {
        int databaseSizeBeforeTest = inputRepository.findAll().size();
        // set the field null
        input.setInputDate(null);

        // Create the Input, which fails.

        restInputMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(input)))
            .andExpect(status().isBadRequest());

        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllInputs() throws Exception {
        // Initialize the database
        inputRepository.saveAndFlush(input);

        // Get all the inputList
        restInputMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(input.getId().intValue())))
            .andExpect(jsonPath("$.[*].comment").value(hasItem(DEFAULT_COMMENT)))
            .andExpect(jsonPath("$.[*].feelings").value(hasItem(DEFAULT_FEELINGS)))
            .andExpect(jsonPath("$.[*].inputDate").value(hasItem(DEFAULT_INPUT_DATE.toString())));
    }

    @Test
    @Transactional
    void getInput() throws Exception {
        // Initialize the database
        inputRepository.saveAndFlush(input);

        // Get the input
        restInputMockMvc
            .perform(get(ENTITY_API_URL_ID, input.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(input.getId().intValue()))
            .andExpect(jsonPath("$.comment").value(DEFAULT_COMMENT))
            .andExpect(jsonPath("$.feelings").value(DEFAULT_FEELINGS))
            .andExpect(jsonPath("$.inputDate").value(DEFAULT_INPUT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingInput() throws Exception {
        // Get the input
        restInputMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewInput() throws Exception {
        // Initialize the database
        inputRepository.saveAndFlush(input);

        int databaseSizeBeforeUpdate = inputRepository.findAll().size();

        // Update the input
        Input updatedInput = inputRepository.findById(input.getId()).get();
        // Disconnect from session so that the updates on updatedInput are not directly saved in db
        em.detach(updatedInput);
        updatedInput.comment(UPDATED_COMMENT).feelings(UPDATED_FEELINGS).inputDate(UPDATED_INPUT_DATE);

        restInputMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInput.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInput))
            )
            .andExpect(status().isOk());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeUpdate);
        Input testInput = inputList.get(inputList.size() - 1);
        assertThat(testInput.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testInput.getFeelings()).isEqualTo(UPDATED_FEELINGS);
        assertThat(testInput.getInputDate()).isEqualTo(UPDATED_INPUT_DATE);
    }

    @Test
    @Transactional
    void putNonExistingInput() throws Exception {
        int databaseSizeBeforeUpdate = inputRepository.findAll().size();
        input.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInputMockMvc
            .perform(
                put(ENTITY_API_URL_ID, input.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(input))
            )
            .andExpect(status().isBadRequest());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInput() throws Exception {
        int databaseSizeBeforeUpdate = inputRepository.findAll().size();
        input.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInputMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(input))
            )
            .andExpect(status().isBadRequest());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInput() throws Exception {
        int databaseSizeBeforeUpdate = inputRepository.findAll().size();
        input.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInputMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(input)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInputWithPatch() throws Exception {
        // Initialize the database
        inputRepository.saveAndFlush(input);

        int databaseSizeBeforeUpdate = inputRepository.findAll().size();

        // Update the input using partial update
        Input partialUpdatedInput = new Input();
        partialUpdatedInput.setId(input.getId());

        partialUpdatedInput.feelings(UPDATED_FEELINGS).inputDate(UPDATED_INPUT_DATE);

        restInputMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInput.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInput))
            )
            .andExpect(status().isOk());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeUpdate);
        Input testInput = inputList.get(inputList.size() - 1);
        assertThat(testInput.getComment()).isEqualTo(DEFAULT_COMMENT);
        assertThat(testInput.getFeelings()).isEqualTo(UPDATED_FEELINGS);
        assertThat(testInput.getInputDate()).isEqualTo(UPDATED_INPUT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateInputWithPatch() throws Exception {
        // Initialize the database
        inputRepository.saveAndFlush(input);

        int databaseSizeBeforeUpdate = inputRepository.findAll().size();

        // Update the input using partial update
        Input partialUpdatedInput = new Input();
        partialUpdatedInput.setId(input.getId());

        partialUpdatedInput.comment(UPDATED_COMMENT).feelings(UPDATED_FEELINGS).inputDate(UPDATED_INPUT_DATE);

        restInputMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInput.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInput))
            )
            .andExpect(status().isOk());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeUpdate);
        Input testInput = inputList.get(inputList.size() - 1);
        assertThat(testInput.getComment()).isEqualTo(UPDATED_COMMENT);
        assertThat(testInput.getFeelings()).isEqualTo(UPDATED_FEELINGS);
        assertThat(testInput.getInputDate()).isEqualTo(UPDATED_INPUT_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingInput() throws Exception {
        int databaseSizeBeforeUpdate = inputRepository.findAll().size();
        input.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInputMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, input.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(input))
            )
            .andExpect(status().isBadRequest());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInput() throws Exception {
        int databaseSizeBeforeUpdate = inputRepository.findAll().size();
        input.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInputMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(input))
            )
            .andExpect(status().isBadRequest());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInput() throws Exception {
        int databaseSizeBeforeUpdate = inputRepository.findAll().size();
        input.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInputMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(input)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Input in the database
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInput() throws Exception {
        // Initialize the database
        inputRepository.saveAndFlush(input);

        int databaseSizeBeforeDelete = inputRepository.findAll().size();

        // Delete the input
        restInputMockMvc
            .perform(delete(ENTITY_API_URL_ID, input.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Input> inputList = inputRepository.findAll();
        assertThat(inputList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
