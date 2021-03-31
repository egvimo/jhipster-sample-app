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
import sample.domain.Xyz;
import sample.repository.XyzRepository;

/**
 * Integration tests for the {@link XyzResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class XyzResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/xyzs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private XyzRepository xyzRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restXyzMockMvc;

    private Xyz xyz;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Xyz createEntity(EntityManager em) {
        Xyz xyz = new Xyz().name(DEFAULT_NAME);
        return xyz;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Xyz createUpdatedEntity(EntityManager em) {
        Xyz xyz = new Xyz().name(UPDATED_NAME);
        return xyz;
    }

    @BeforeEach
    public void initTest() {
        xyz = createEntity(em);
    }

    @Test
    @Transactional
    void createXyz() throws Exception {
        int databaseSizeBeforeCreate = xyzRepository.findAll().size();
        // Create the Xyz
        restXyzMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(xyz))
            )
            .andExpect(status().isCreated());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeCreate + 1);
        Xyz testXyz = xyzList.get(xyzList.size() - 1);
        assertThat(testXyz.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createXyzWithExistingId() throws Exception {
        // Create the Xyz with an existing ID
        xyz.setId(1L);

        int databaseSizeBeforeCreate = xyzRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restXyzMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(xyz))
            )
            .andExpect(status().isBadRequest());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = xyzRepository.findAll().size();
        // set the field null
        xyz.setName(null);

        // Create the Xyz, which fails.

        restXyzMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(xyz))
            )
            .andExpect(status().isBadRequest());

        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllXyzs() throws Exception {
        // Initialize the database
        xyzRepository.saveAndFlush(xyz);

        // Get all the xyzList
        restXyzMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(xyz.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getXyz() throws Exception {
        // Initialize the database
        xyzRepository.saveAndFlush(xyz);

        // Get the xyz
        restXyzMockMvc
            .perform(get(ENTITY_API_URL_ID, xyz.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(xyz.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingXyz() throws Exception {
        // Get the xyz
        restXyzMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewXyz() throws Exception {
        // Initialize the database
        xyzRepository.saveAndFlush(xyz);

        int databaseSizeBeforeUpdate = xyzRepository.findAll().size();

        // Update the xyz
        Xyz updatedXyz = xyzRepository.findById(xyz.getId()).get();
        // Disconnect from session so that the updates on updatedXyz are not directly saved in db
        em.detach(updatedXyz);
        updatedXyz.name(UPDATED_NAME);

        restXyzMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedXyz.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedXyz))
            )
            .andExpect(status().isOk());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeUpdate);
        Xyz testXyz = xyzList.get(xyzList.size() - 1);
        assertThat(testXyz.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingXyz() throws Exception {
        int databaseSizeBeforeUpdate = xyzRepository.findAll().size();
        xyz.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restXyzMockMvc
            .perform(
                put(ENTITY_API_URL_ID, xyz.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(xyz))
            )
            .andExpect(status().isBadRequest());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchXyz() throws Exception {
        int databaseSizeBeforeUpdate = xyzRepository.findAll().size();
        xyz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restXyzMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(xyz))
            )
            .andExpect(status().isBadRequest());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamXyz() throws Exception {
        int databaseSizeBeforeUpdate = xyzRepository.findAll().size();
        xyz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restXyzMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(xyz))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateXyzWithPatch() throws Exception {
        // Initialize the database
        xyzRepository.saveAndFlush(xyz);

        int databaseSizeBeforeUpdate = xyzRepository.findAll().size();

        // Update the xyz using partial update
        Xyz partialUpdatedXyz = new Xyz();
        partialUpdatedXyz.setId(xyz.getId());

        restXyzMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedXyz.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedXyz))
            )
            .andExpect(status().isOk());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeUpdate);
        Xyz testXyz = xyzList.get(xyzList.size() - 1);
        assertThat(testXyz.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateXyzWithPatch() throws Exception {
        // Initialize the database
        xyzRepository.saveAndFlush(xyz);

        int databaseSizeBeforeUpdate = xyzRepository.findAll().size();

        // Update the xyz using partial update
        Xyz partialUpdatedXyz = new Xyz();
        partialUpdatedXyz.setId(xyz.getId());

        partialUpdatedXyz.name(UPDATED_NAME);

        restXyzMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedXyz.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedXyz))
            )
            .andExpect(status().isOk());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeUpdate);
        Xyz testXyz = xyzList.get(xyzList.size() - 1);
        assertThat(testXyz.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingXyz() throws Exception {
        int databaseSizeBeforeUpdate = xyzRepository.findAll().size();
        xyz.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restXyzMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, xyz.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(xyz))
            )
            .andExpect(status().isBadRequest());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchXyz() throws Exception {
        int databaseSizeBeforeUpdate = xyzRepository.findAll().size();
        xyz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restXyzMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(xyz))
            )
            .andExpect(status().isBadRequest());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamXyz() throws Exception {
        int databaseSizeBeforeUpdate = xyzRepository.findAll().size();
        xyz.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restXyzMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(xyz))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Xyz in the database
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteXyz() throws Exception {
        // Initialize the database
        xyzRepository.saveAndFlush(xyz);

        int databaseSizeBeforeDelete = xyzRepository.findAll().size();

        // Delete the xyz
        restXyzMockMvc
            .perform(delete(ENTITY_API_URL_ID, xyz.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Xyz> xyzList = xyzRepository.findAll();
        assertThat(xyzList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
