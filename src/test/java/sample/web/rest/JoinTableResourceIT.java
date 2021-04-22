package sample.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

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
import sample.IntegrationTest;
import sample.domain.Abc;
import sample.domain.JoinTable;
import sample.domain.Xyz;
import sample.repository.JoinTableRepository;

/**
 * Integration tests for the {@link JoinTableResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JoinTableResourceIT {

    private static final String DEFAULT_ADDITIONAL_COLUMN = "AAAAAAAAAA";
    private static final String UPDATED_ADDITIONAL_COLUMN = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/join-tables";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JoinTableRepository joinTableRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJoinTableMockMvc;

    private JoinTable joinTable;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JoinTable createEntity(EntityManager em) {
        JoinTable joinTable = new JoinTable().additionalColumn(DEFAULT_ADDITIONAL_COLUMN);
        // Add required entity
        Abc abc;
        if (TestUtil.findAll(em, Abc.class).isEmpty()) {
            abc = AbcResourceIT.createEntity(em);
            em.persist(abc);
            em.flush();
        } else {
            abc = TestUtil.findAll(em, Abc.class).get(0);
        }
        joinTable.setAbc(abc);
        // Add required entity
        Xyz xyz;
        if (TestUtil.findAll(em, Xyz.class).isEmpty()) {
            xyz = XyzResourceIT.createEntity(em);
            em.persist(xyz);
            em.flush();
        } else {
            xyz = TestUtil.findAll(em, Xyz.class).get(0);
        }
        joinTable.setXyz(xyz);
        return joinTable;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JoinTable createUpdatedEntity(EntityManager em) {
        JoinTable joinTable = new JoinTable().additionalColumn(UPDATED_ADDITIONAL_COLUMN);
        // Add required entity
        Abc abc;
        if (TestUtil.findAll(em, Abc.class).isEmpty()) {
            abc = AbcResourceIT.createUpdatedEntity(em);
            em.persist(abc);
            em.flush();
        } else {
            abc = TestUtil.findAll(em, Abc.class).get(0);
        }
        joinTable.setAbc(abc);
        // Add required entity
        Xyz xyz;
        if (TestUtil.findAll(em, Xyz.class).isEmpty()) {
            xyz = XyzResourceIT.createUpdatedEntity(em);
            em.persist(xyz);
            em.flush();
        } else {
            xyz = TestUtil.findAll(em, Xyz.class).get(0);
        }
        joinTable.setXyz(xyz);
        return joinTable;
    }

    @BeforeEach
    public void initTest() {
        joinTable = createEntity(em);
    }

    @Test
    @Transactional
    void createJoinTable() throws Exception {
        int databaseSizeBeforeCreate = joinTableRepository.findAll().size();
        // Create the JoinTable
        restJoinTableMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTable))
            )
            .andExpect(status().isCreated());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeCreate + 1);
        JoinTable testJoinTable = joinTableList.get(joinTableList.size() - 1);
        assertThat(testJoinTable.getAdditionalColumn()).isEqualTo(DEFAULT_ADDITIONAL_COLUMN);
    }

    @Test
    @Transactional
    void createJoinTableWithExistingId() throws Exception {
        // Create the JoinTable with an existing ID
        joinTable.setId(1L);

        int databaseSizeBeforeCreate = joinTableRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJoinTableMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAdditionalColumnIsRequired() throws Exception {
        int databaseSizeBeforeTest = joinTableRepository.findAll().size();
        // set the field null
        joinTable.setAdditionalColumn(null);

        // Create the JoinTable, which fails.

        restJoinTableMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTable))
            )
            .andExpect(status().isBadRequest());

        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllJoinTables() throws Exception {
        // Initialize the database
        joinTableRepository.saveAndFlush(joinTable);

        // Get all the joinTableList
        restJoinTableMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(joinTable.getId().intValue())))
            .andExpect(jsonPath("$.[*].additionalColumn").value(hasItem(DEFAULT_ADDITIONAL_COLUMN)));
    }

    @Test
    @Transactional
    void getJoinTable() throws Exception {
        // Initialize the database
        joinTableRepository.saveAndFlush(joinTable);

        // Get the joinTable
        restJoinTableMockMvc
            .perform(get(ENTITY_API_URL_ID, joinTable.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(joinTable.getId().intValue()))
            .andExpect(jsonPath("$.additionalColumn").value(DEFAULT_ADDITIONAL_COLUMN));
    }

    @Test
    @Transactional
    void getNonExistingJoinTable() throws Exception {
        // Get the joinTable
        restJoinTableMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewJoinTable() throws Exception {
        // Initialize the database
        joinTableRepository.saveAndFlush(joinTable);

        int databaseSizeBeforeUpdate = joinTableRepository.findAll().size();

        // Update the joinTable
        JoinTable updatedJoinTable = joinTableRepository.findById(joinTable.getId()).get();
        // Disconnect from session so that the updates on updatedJoinTable are not directly saved in db
        em.detach(updatedJoinTable);
        updatedJoinTable.additionalColumn(UPDATED_ADDITIONAL_COLUMN);

        restJoinTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJoinTable.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJoinTable))
            )
            .andExpect(status().isOk());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeUpdate);
        JoinTable testJoinTable = joinTableList.get(joinTableList.size() - 1);
        assertThat(testJoinTable.getAdditionalColumn()).isEqualTo(UPDATED_ADDITIONAL_COLUMN);
    }

    @Test
    @Transactional
    void putNonExistingJoinTable() throws Exception {
        int databaseSizeBeforeUpdate = joinTableRepository.findAll().size();
        joinTable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJoinTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, joinTable.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJoinTable() throws Exception {
        int databaseSizeBeforeUpdate = joinTableRepository.findAll().size();
        joinTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinTableMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJoinTable() throws Exception {
        int databaseSizeBeforeUpdate = joinTableRepository.findAll().size();
        joinTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinTableMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJoinTableWithPatch() throws Exception {
        // Initialize the database
        joinTableRepository.saveAndFlush(joinTable);

        int databaseSizeBeforeUpdate = joinTableRepository.findAll().size();

        // Update the joinTable using partial update
        JoinTable partialUpdatedJoinTable = new JoinTable();
        partialUpdatedJoinTable.setId(joinTable.getId());

        partialUpdatedJoinTable.additionalColumn(UPDATED_ADDITIONAL_COLUMN);

        restJoinTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJoinTable.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJoinTable))
            )
            .andExpect(status().isOk());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeUpdate);
        JoinTable testJoinTable = joinTableList.get(joinTableList.size() - 1);
        assertThat(testJoinTable.getAdditionalColumn()).isEqualTo(UPDATED_ADDITIONAL_COLUMN);
    }

    @Test
    @Transactional
    void fullUpdateJoinTableWithPatch() throws Exception {
        // Initialize the database
        joinTableRepository.saveAndFlush(joinTable);

        int databaseSizeBeforeUpdate = joinTableRepository.findAll().size();

        // Update the joinTable using partial update
        JoinTable partialUpdatedJoinTable = new JoinTable();
        partialUpdatedJoinTable.setId(joinTable.getId());

        partialUpdatedJoinTable.additionalColumn(UPDATED_ADDITIONAL_COLUMN);

        restJoinTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJoinTable.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJoinTable))
            )
            .andExpect(status().isOk());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeUpdate);
        JoinTable testJoinTable = joinTableList.get(joinTableList.size() - 1);
        assertThat(testJoinTable.getAdditionalColumn()).isEqualTo(UPDATED_ADDITIONAL_COLUMN);
    }

    @Test
    @Transactional
    void patchNonExistingJoinTable() throws Exception {
        int databaseSizeBeforeUpdate = joinTableRepository.findAll().size();
        joinTable.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJoinTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, joinTable.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(joinTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJoinTable() throws Exception {
        int databaseSizeBeforeUpdate = joinTableRepository.findAll().size();
        joinTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinTableMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(joinTable))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJoinTable() throws Exception {
        int databaseSizeBeforeUpdate = joinTableRepository.findAll().size();
        joinTable.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinTableMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(joinTable))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JoinTable in the database
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJoinTable() throws Exception {
        // Initialize the database
        joinTableRepository.saveAndFlush(joinTable);

        int databaseSizeBeforeDelete = joinTableRepository.findAll().size();

        // Delete the joinTable
        restJoinTableMockMvc
            .perform(delete(ENTITY_API_URL_ID, joinTable.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JoinTable> joinTableList = joinTableRepository.findAll();
        assertThat(joinTableList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
