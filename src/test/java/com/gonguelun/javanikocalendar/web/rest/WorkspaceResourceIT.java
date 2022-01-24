package com.gonguelun.javanikocalendar.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.gonguelun.javanikocalendar.IntegrationTest;
import com.gonguelun.javanikocalendar.domain.Workspace;
import com.gonguelun.javanikocalendar.repository.WorkspaceRepository;
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
 * Integration tests for the {@link WorkspaceResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WorkspaceResourceIT {

    private static final String DEFAULT_LOGIN = "AAAAAAAAAA";
    private static final String UPDATED_LOGIN = "BBBBBBBBBB";

    private static final String DEFAULT_REPOS_URL = "AAAAAAAAAA";
    private static final String UPDATED_REPOS_URL = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/workspaces";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWorkspaceMockMvc;

    private Workspace workspace;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Workspace createEntity(EntityManager em) {
        Workspace workspace = new Workspace().login(DEFAULT_LOGIN).repos_url(DEFAULT_REPOS_URL).description(DEFAULT_DESCRIPTION);
        return workspace;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Workspace createUpdatedEntity(EntityManager em) {
        Workspace workspace = new Workspace().login(UPDATED_LOGIN).repos_url(UPDATED_REPOS_URL).description(UPDATED_DESCRIPTION);
        return workspace;
    }

    @BeforeEach
    public void initTest() {
        workspace = createEntity(em);
    }

    @Test
    @Transactional
    void createWorkspace() throws Exception {
        int databaseSizeBeforeCreate = workspaceRepository.findAll().size();
        // Create the Workspace
        restWorkspaceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workspace)))
            .andExpect(status().isCreated());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeCreate + 1);
        Workspace testWorkspace = workspaceList.get(workspaceList.size() - 1);
        assertThat(testWorkspace.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(testWorkspace.getrepos_url()).isEqualTo(DEFAULT_REPOS_URL);
        assertThat(testWorkspace.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createWorkspaceWithExistingId() throws Exception {
        // Create the Workspace with an existing ID
        workspace.setId(1L);

        int databaseSizeBeforeCreate = workspaceRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWorkspaceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workspace)))
            .andExpect(status().isBadRequest());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLoginIsRequired() throws Exception {
        int databaseSizeBeforeTest = workspaceRepository.findAll().size();
        // set the field null
        workspace.setLogin(null);

        // Create the Workspace, which fails.

        restWorkspaceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workspace)))
            .andExpect(status().isBadRequest());

        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void checkDescriptionIsRequired() throws Exception {
        int databaseSizeBeforeTest = workspaceRepository.findAll().size();
        // set the field null
        workspace.setDescription(null);

        // Create the Workspace, which fails.

        restWorkspaceMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workspace)))
            .andExpect(status().isBadRequest());

        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllWorkspaces() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        // Get all the workspaceList
        restWorkspaceMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(workspace.getId().intValue())))
            .andExpect(jsonPath("$.[*].login").value(hasItem(DEFAULT_LOGIN)))
            .andExpect(jsonPath("$.[*].repos_url").value(hasItem(DEFAULT_REPOS_URL)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getWorkspace() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        // Get the workspace
        restWorkspaceMockMvc
            .perform(get(ENTITY_API_URL_ID, workspace.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(workspace.getId().intValue()))
            .andExpect(jsonPath("$.login").value(DEFAULT_LOGIN))
            .andExpect(jsonPath("$.repos_url").value(DEFAULT_REPOS_URL))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingWorkspace() throws Exception {
        // Get the workspace
        restWorkspaceMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewWorkspace() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();

        // Update the workspace
        Workspace updatedWorkspace = workspaceRepository.findById(workspace.getId()).get();
        // Disconnect from session so that the updates on updatedWorkspace are not directly saved in db
        em.detach(updatedWorkspace);
        updatedWorkspace.login(UPDATED_LOGIN).repos_url(UPDATED_REPOS_URL).description(UPDATED_DESCRIPTION);

        restWorkspaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWorkspace.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWorkspace))
            )
            .andExpect(status().isOk());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
        Workspace testWorkspace = workspaceList.get(workspaceList.size() - 1);
        assertThat(testWorkspace.getLogin()).isEqualTo(UPDATED_LOGIN);
        assertThat(testWorkspace.getrepos_url()).isEqualTo(UPDATED_REPOS_URL);
        assertThat(testWorkspace.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, workspace.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workspace))
            )
            .andExpect(status().isBadRequest());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(workspace))
            )
            .andExpect(status().isBadRequest());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(workspace)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWorkspaceWithPatch() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();

        // Update the workspace using partial update
        Workspace partialUpdatedWorkspace = new Workspace();
        partialUpdatedWorkspace.setId(workspace.getId());

        partialUpdatedWorkspace.login(UPDATED_LOGIN).description(UPDATED_DESCRIPTION);

        restWorkspaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkspace.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkspace))
            )
            .andExpect(status().isOk());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
        Workspace testWorkspace = workspaceList.get(workspaceList.size() - 1);
        assertThat(testWorkspace.getLogin()).isEqualTo(UPDATED_LOGIN);
        assertThat(testWorkspace.getrepos_url()).isEqualTo(DEFAULT_REPOS_URL);
        assertThat(testWorkspace.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateWorkspaceWithPatch() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();

        // Update the workspace using partial update
        Workspace partialUpdatedWorkspace = new Workspace();
        partialUpdatedWorkspace.setId(workspace.getId());

        partialUpdatedWorkspace.login(UPDATED_LOGIN).repos_url(UPDATED_REPOS_URL).description(UPDATED_DESCRIPTION);

        restWorkspaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWorkspace.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWorkspace))
            )
            .andExpect(status().isOk());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
        Workspace testWorkspace = workspaceList.get(workspaceList.size() - 1);
        assertThat(testWorkspace.getLogin()).isEqualTo(UPDATED_LOGIN);
        assertThat(testWorkspace.getrepos_url()).isEqualTo(UPDATED_REPOS_URL);
        assertThat(testWorkspace.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, workspace.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workspace))
            )
            .andExpect(status().isBadRequest());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(workspace))
            )
            .andExpect(status().isBadRequest());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWorkspace() throws Exception {
        int databaseSizeBeforeUpdate = workspaceRepository.findAll().size();
        workspace.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWorkspaceMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(workspace))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Workspace in the database
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWorkspace() throws Exception {
        // Initialize the database
        workspaceRepository.saveAndFlush(workspace);

        int databaseSizeBeforeDelete = workspaceRepository.findAll().size();

        // Delete the workspace
        restWorkspaceMockMvc
            .perform(delete(ENTITY_API_URL_ID, workspace.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Workspace> workspaceList = workspaceRepository.findAll();
        assertThat(workspaceList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
