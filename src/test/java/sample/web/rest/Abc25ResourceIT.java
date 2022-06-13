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
import sample.domain.Abc25;
import sample.repository.Abc25Repository;

/**
 * Integration tests for the {@link Abc25Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc25ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-25-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc25Repository abc25Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc25MockMvc;

    private Abc25 abc25;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc25 createEntity(EntityManager em) {
        Abc25 abc25 = new Abc25().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc25;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc25 createUpdatedEntity(EntityManager em) {
        Abc25 abc25 = new Abc25().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc25;
    }

    @BeforeEach
    public void initTest() {
        abc25 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc25() throws Exception {
        int databaseSizeBeforeCreate = abc25Repository.findAll().size();
        // Create the Abc25
        restAbc25MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc25))
            )
            .andExpect(status().isCreated());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeCreate + 1);
        Abc25 testAbc25 = abc25List.get(abc25List.size() - 1);
        assertThat(testAbc25.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc25.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc25WithExistingId() throws Exception {
        // Create the Abc25 with an existing ID
        abc25.setId(1L);

        int databaseSizeBeforeCreate = abc25Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc25MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc25))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc25Repository.findAll().size();
        // set the field null
        abc25.setName(null);

        // Create the Abc25, which fails.

        restAbc25MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc25))
            )
            .andExpect(status().isBadRequest());

        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc25s() throws Exception {
        // Initialize the database
        abc25Repository.saveAndFlush(abc25);

        // Get all the abc25List
        restAbc25MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc25.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc25() throws Exception {
        // Initialize the database
        abc25Repository.saveAndFlush(abc25);

        // Get the abc25
        restAbc25MockMvc
            .perform(get(ENTITY_API_URL_ID, abc25.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc25.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc25() throws Exception {
        // Get the abc25
        restAbc25MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc25() throws Exception {
        // Initialize the database
        abc25Repository.saveAndFlush(abc25);

        int databaseSizeBeforeUpdate = abc25Repository.findAll().size();

        // Update the abc25
        Abc25 updatedAbc25 = abc25Repository.findById(abc25.getId()).get();
        // Disconnect from session so that the updates on updatedAbc25 are not directly saved in db
        em.detach(updatedAbc25);
        updatedAbc25.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc25MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc25.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc25))
            )
            .andExpect(status().isOk());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeUpdate);
        Abc25 testAbc25 = abc25List.get(abc25List.size() - 1);
        assertThat(testAbc25.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc25.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc25() throws Exception {
        int databaseSizeBeforeUpdate = abc25Repository.findAll().size();
        abc25.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc25MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc25.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc25))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc25() throws Exception {
        int databaseSizeBeforeUpdate = abc25Repository.findAll().size();
        abc25.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc25MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc25))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc25() throws Exception {
        int databaseSizeBeforeUpdate = abc25Repository.findAll().size();
        abc25.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc25MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc25))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc25WithPatch() throws Exception {
        // Initialize the database
        abc25Repository.saveAndFlush(abc25);

        int databaseSizeBeforeUpdate = abc25Repository.findAll().size();

        // Update the abc25 using partial update
        Abc25 partialUpdatedAbc25 = new Abc25();
        partialUpdatedAbc25.setId(abc25.getId());

        partialUpdatedAbc25.name(UPDATED_NAME);

        restAbc25MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc25.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc25))
            )
            .andExpect(status().isOk());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeUpdate);
        Abc25 testAbc25 = abc25List.get(abc25List.size() - 1);
        assertThat(testAbc25.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc25.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc25WithPatch() throws Exception {
        // Initialize the database
        abc25Repository.saveAndFlush(abc25);

        int databaseSizeBeforeUpdate = abc25Repository.findAll().size();

        // Update the abc25 using partial update
        Abc25 partialUpdatedAbc25 = new Abc25();
        partialUpdatedAbc25.setId(abc25.getId());

        partialUpdatedAbc25.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc25MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc25.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc25))
            )
            .andExpect(status().isOk());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeUpdate);
        Abc25 testAbc25 = abc25List.get(abc25List.size() - 1);
        assertThat(testAbc25.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc25.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc25() throws Exception {
        int databaseSizeBeforeUpdate = abc25Repository.findAll().size();
        abc25.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc25MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc25.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc25))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc25() throws Exception {
        int databaseSizeBeforeUpdate = abc25Repository.findAll().size();
        abc25.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc25MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc25))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc25() throws Exception {
        int databaseSizeBeforeUpdate = abc25Repository.findAll().size();
        abc25.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc25MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc25))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc25 in the database
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc25() throws Exception {
        // Initialize the database
        abc25Repository.saveAndFlush(abc25);

        int databaseSizeBeforeDelete = abc25Repository.findAll().size();

        // Delete the abc25
        restAbc25MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc25.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc25> abc25List = abc25Repository.findAll();
        assertThat(abc25List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
