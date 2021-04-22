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
import sample.domain.JoinTableAbcXyz;
import sample.domain.Xyz;
import sample.repository.JoinTableAbcXyzRepository;

/**
 * Integration tests for the {@link JoinTableAbcXyzResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class JoinTableAbcXyzResourceIT {

    private static final String DEFAULT_ADDITIONAL_COLUMN = "AAAAAAAAAA";
    private static final String UPDATED_ADDITIONAL_COLUMN = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/join-table-abc-xyzs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private JoinTableAbcXyzRepository joinTableAbcXyzRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restJoinTableAbcXyzMockMvc;

    private JoinTableAbcXyz joinTableAbcXyz;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JoinTableAbcXyz createEntity(EntityManager em) {
        JoinTableAbcXyz joinTableAbcXyz = new JoinTableAbcXyz().additionalColumn(DEFAULT_ADDITIONAL_COLUMN);
        // Add required entity
        Abc abc;
        if (TestUtil.findAll(em, Abc.class).isEmpty()) {
            abc = AbcResourceIT.createEntity(em);
            em.persist(abc);
            em.flush();
        } else {
            abc = TestUtil.findAll(em, Abc.class).get(0);
        }
        joinTableAbcXyz.setAbc(abc);
        // Add required entity
        Xyz xyz;
        if (TestUtil.findAll(em, Xyz.class).isEmpty()) {
            xyz = XyzResourceIT.createEntity(em);
            em.persist(xyz);
            em.flush();
        } else {
            xyz = TestUtil.findAll(em, Xyz.class).get(0);
        }
        joinTableAbcXyz.setXyz(xyz);
        return joinTableAbcXyz;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static JoinTableAbcXyz createUpdatedEntity(EntityManager em) {
        JoinTableAbcXyz joinTableAbcXyz = new JoinTableAbcXyz().additionalColumn(UPDATED_ADDITIONAL_COLUMN);
        // Add required entity
        Abc abc;
        if (TestUtil.findAll(em, Abc.class).isEmpty()) {
            abc = AbcResourceIT.createUpdatedEntity(em);
            em.persist(abc);
            em.flush();
        } else {
            abc = TestUtil.findAll(em, Abc.class).get(0);
        }
        joinTableAbcXyz.setAbc(abc);
        // Add required entity
        Xyz xyz;
        if (TestUtil.findAll(em, Xyz.class).isEmpty()) {
            xyz = XyzResourceIT.createUpdatedEntity(em);
            em.persist(xyz);
            em.flush();
        } else {
            xyz = TestUtil.findAll(em, Xyz.class).get(0);
        }
        joinTableAbcXyz.setXyz(xyz);
        return joinTableAbcXyz;
    }

    @BeforeEach
    public void initTest() {
        joinTableAbcXyz = createEntity(em);
    }

    @Test
    @Transactional
    void createJoinTableAbcXyz() throws Exception {
        int databaseSizeBeforeCreate = joinTableAbcXyzRepository.findAll().size();
        // Create the JoinTableAbcXyz
        restJoinTableAbcXyzMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTableAbcXyz))
            )
            .andExpect(status().isCreated());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeCreate + 1);
        JoinTableAbcXyz testJoinTableAbcXyz = joinTableAbcXyzList.get(joinTableAbcXyzList.size() - 1);
        assertThat(testJoinTableAbcXyz.getAdditionalColumn()).isEqualTo(DEFAULT_ADDITIONAL_COLUMN);
    }

    @Test
    @Transactional
    void createJoinTableAbcXyzWithExistingId() throws Exception {
        // Create the JoinTableAbcXyz with an existing ID
        joinTableAbcXyz.setId(1L);

        int databaseSizeBeforeCreate = joinTableAbcXyzRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restJoinTableAbcXyzMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTableAbcXyz))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkAdditionalColumnIsRequired() throws Exception {
        int databaseSizeBeforeTest = joinTableAbcXyzRepository.findAll().size();
        // set the field null
        joinTableAbcXyz.setAdditionalColumn(null);

        // Create the JoinTableAbcXyz, which fails.

        restJoinTableAbcXyzMockMvc
            .perform(
                post(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTableAbcXyz))
            )
            .andExpect(status().isBadRequest());

        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllJoinTableAbcXyzs() throws Exception {
        // Initialize the database
        joinTableAbcXyzRepository.saveAndFlush(joinTableAbcXyz);

        // Get all the joinTableAbcXyzList
        restJoinTableAbcXyzMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(joinTableAbcXyz.getId().intValue())))
            .andExpect(jsonPath("$.[*].additionalColumn").value(hasItem(DEFAULT_ADDITIONAL_COLUMN)));
    }

    @Test
    @Transactional
    void getJoinTableAbcXyz() throws Exception {
        // Initialize the database
        joinTableAbcXyzRepository.saveAndFlush(joinTableAbcXyz);

        // Get the joinTableAbcXyz
        restJoinTableAbcXyzMockMvc
            .perform(get(ENTITY_API_URL_ID, joinTableAbcXyz.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(joinTableAbcXyz.getId().intValue()))
            .andExpect(jsonPath("$.additionalColumn").value(DEFAULT_ADDITIONAL_COLUMN));
    }

    @Test
    @Transactional
    void getNonExistingJoinTableAbcXyz() throws Exception {
        // Get the joinTableAbcXyz
        restJoinTableAbcXyzMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewJoinTableAbcXyz() throws Exception {
        // Initialize the database
        joinTableAbcXyzRepository.saveAndFlush(joinTableAbcXyz);

        int databaseSizeBeforeUpdate = joinTableAbcXyzRepository.findAll().size();

        // Update the joinTableAbcXyz
        JoinTableAbcXyz updatedJoinTableAbcXyz = joinTableAbcXyzRepository.findById(joinTableAbcXyz.getId()).get();
        // Disconnect from session so that the updates on updatedJoinTableAbcXyz are not directly saved in db
        em.detach(updatedJoinTableAbcXyz);
        updatedJoinTableAbcXyz.additionalColumn(UPDATED_ADDITIONAL_COLUMN);

        restJoinTableAbcXyzMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedJoinTableAbcXyz.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedJoinTableAbcXyz))
            )
            .andExpect(status().isOk());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeUpdate);
        JoinTableAbcXyz testJoinTableAbcXyz = joinTableAbcXyzList.get(joinTableAbcXyzList.size() - 1);
        assertThat(testJoinTableAbcXyz.getAdditionalColumn()).isEqualTo(UPDATED_ADDITIONAL_COLUMN);
    }

    @Test
    @Transactional
    void putNonExistingJoinTableAbcXyz() throws Exception {
        int databaseSizeBeforeUpdate = joinTableAbcXyzRepository.findAll().size();
        joinTableAbcXyz.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJoinTableAbcXyzMockMvc
            .perform(
                put(ENTITY_API_URL_ID, joinTableAbcXyz.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTableAbcXyz))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchJoinTableAbcXyz() throws Exception {
        int databaseSizeBeforeUpdate = joinTableAbcXyzRepository.findAll().size();
        joinTableAbcXyz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinTableAbcXyzMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTableAbcXyz))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamJoinTableAbcXyz() throws Exception {
        int databaseSizeBeforeUpdate = joinTableAbcXyzRepository.findAll().size();
        joinTableAbcXyz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinTableAbcXyzMockMvc
            .perform(
                put(ENTITY_API_URL)
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(joinTableAbcXyz))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateJoinTableAbcXyzWithPatch() throws Exception {
        // Initialize the database
        joinTableAbcXyzRepository.saveAndFlush(joinTableAbcXyz);

        int databaseSizeBeforeUpdate = joinTableAbcXyzRepository.findAll().size();

        // Update the joinTableAbcXyz using partial update
        JoinTableAbcXyz partialUpdatedJoinTableAbcXyz = new JoinTableAbcXyz();
        partialUpdatedJoinTableAbcXyz.setId(joinTableAbcXyz.getId());

        restJoinTableAbcXyzMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJoinTableAbcXyz.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJoinTableAbcXyz))
            )
            .andExpect(status().isOk());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeUpdate);
        JoinTableAbcXyz testJoinTableAbcXyz = joinTableAbcXyzList.get(joinTableAbcXyzList.size() - 1);
        assertThat(testJoinTableAbcXyz.getAdditionalColumn()).isEqualTo(DEFAULT_ADDITIONAL_COLUMN);
    }

    @Test
    @Transactional
    void fullUpdateJoinTableAbcXyzWithPatch() throws Exception {
        // Initialize the database
        joinTableAbcXyzRepository.saveAndFlush(joinTableAbcXyz);

        int databaseSizeBeforeUpdate = joinTableAbcXyzRepository.findAll().size();

        // Update the joinTableAbcXyz using partial update
        JoinTableAbcXyz partialUpdatedJoinTableAbcXyz = new JoinTableAbcXyz();
        partialUpdatedJoinTableAbcXyz.setId(joinTableAbcXyz.getId());

        partialUpdatedJoinTableAbcXyz.additionalColumn(UPDATED_ADDITIONAL_COLUMN);

        restJoinTableAbcXyzMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedJoinTableAbcXyz.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedJoinTableAbcXyz))
            )
            .andExpect(status().isOk());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeUpdate);
        JoinTableAbcXyz testJoinTableAbcXyz = joinTableAbcXyzList.get(joinTableAbcXyzList.size() - 1);
        assertThat(testJoinTableAbcXyz.getAdditionalColumn()).isEqualTo(UPDATED_ADDITIONAL_COLUMN);
    }

    @Test
    @Transactional
    void patchNonExistingJoinTableAbcXyz() throws Exception {
        int databaseSizeBeforeUpdate = joinTableAbcXyzRepository.findAll().size();
        joinTableAbcXyz.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restJoinTableAbcXyzMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, joinTableAbcXyz.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(joinTableAbcXyz))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchJoinTableAbcXyz() throws Exception {
        int databaseSizeBeforeUpdate = joinTableAbcXyzRepository.findAll().size();
        joinTableAbcXyz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinTableAbcXyzMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(joinTableAbcXyz))
            )
            .andExpect(status().isBadRequest());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamJoinTableAbcXyz() throws Exception {
        int databaseSizeBeforeUpdate = joinTableAbcXyzRepository.findAll().size();
        joinTableAbcXyz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restJoinTableAbcXyzMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(joinTableAbcXyz))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the JoinTableAbcXyz in the database
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteJoinTableAbcXyz() throws Exception {
        // Initialize the database
        joinTableAbcXyzRepository.saveAndFlush(joinTableAbcXyz);

        int databaseSizeBeforeDelete = joinTableAbcXyzRepository.findAll().size();

        // Delete the joinTableAbcXyz
        restJoinTableAbcXyzMockMvc
            .perform(delete(ENTITY_API_URL_ID, joinTableAbcXyz.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<JoinTableAbcXyz> joinTableAbcXyzList = joinTableAbcXyzRepository.findAll();
        assertThat(joinTableAbcXyzList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
