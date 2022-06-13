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
import sample.domain.Abc16;
import sample.repository.Abc16Repository;

/**
 * Integration tests for the {@link Abc16Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc16ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-16-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc16Repository abc16Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc16MockMvc;

    private Abc16 abc16;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc16 createEntity(EntityManager em) {
        Abc16 abc16 = new Abc16().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc16;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc16 createUpdatedEntity(EntityManager em) {
        Abc16 abc16 = new Abc16().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc16;
    }

    @BeforeEach
    public void initTest() {
        abc16 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc16() throws Exception {
        int databaseSizeBeforeCreate = abc16Repository.findAll().size();
        // Create the Abc16
        restAbc16MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc16))
            )
            .andExpect(status().isCreated());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeCreate + 1);
        Abc16 testAbc16 = abc16List.get(abc16List.size() - 1);
        assertThat(testAbc16.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc16.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc16WithExistingId() throws Exception {
        // Create the Abc16 with an existing ID
        abc16.setId(1L);

        int databaseSizeBeforeCreate = abc16Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc16MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc16))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc16Repository.findAll().size();
        // set the field null
        abc16.setName(null);

        // Create the Abc16, which fails.

        restAbc16MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc16))
            )
            .andExpect(status().isBadRequest());

        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc16s() throws Exception {
        // Initialize the database
        abc16Repository.saveAndFlush(abc16);

        // Get all the abc16List
        restAbc16MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc16.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc16() throws Exception {
        // Initialize the database
        abc16Repository.saveAndFlush(abc16);

        // Get the abc16
        restAbc16MockMvc
            .perform(get(ENTITY_API_URL_ID, abc16.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc16.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc16() throws Exception {
        // Get the abc16
        restAbc16MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc16() throws Exception {
        // Initialize the database
        abc16Repository.saveAndFlush(abc16);

        int databaseSizeBeforeUpdate = abc16Repository.findAll().size();

        // Update the abc16
        Abc16 updatedAbc16 = abc16Repository.findById(abc16.getId()).get();
        // Disconnect from session so that the updates on updatedAbc16 are not directly saved in db
        em.detach(updatedAbc16);
        updatedAbc16.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc16MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc16.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc16))
            )
            .andExpect(status().isOk());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeUpdate);
        Abc16 testAbc16 = abc16List.get(abc16List.size() - 1);
        assertThat(testAbc16.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc16.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc16() throws Exception {
        int databaseSizeBeforeUpdate = abc16Repository.findAll().size();
        abc16.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc16MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc16.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc16))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc16() throws Exception {
        int databaseSizeBeforeUpdate = abc16Repository.findAll().size();
        abc16.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc16MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc16))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc16() throws Exception {
        int databaseSizeBeforeUpdate = abc16Repository.findAll().size();
        abc16.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc16MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc16))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc16WithPatch() throws Exception {
        // Initialize the database
        abc16Repository.saveAndFlush(abc16);

        int databaseSizeBeforeUpdate = abc16Repository.findAll().size();

        // Update the abc16 using partial update
        Abc16 partialUpdatedAbc16 = new Abc16();
        partialUpdatedAbc16.setId(abc16.getId());

        partialUpdatedAbc16.name(UPDATED_NAME);

        restAbc16MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc16.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc16))
            )
            .andExpect(status().isOk());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeUpdate);
        Abc16 testAbc16 = abc16List.get(abc16List.size() - 1);
        assertThat(testAbc16.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc16.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc16WithPatch() throws Exception {
        // Initialize the database
        abc16Repository.saveAndFlush(abc16);

        int databaseSizeBeforeUpdate = abc16Repository.findAll().size();

        // Update the abc16 using partial update
        Abc16 partialUpdatedAbc16 = new Abc16();
        partialUpdatedAbc16.setId(abc16.getId());

        partialUpdatedAbc16.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc16MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc16.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc16))
            )
            .andExpect(status().isOk());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeUpdate);
        Abc16 testAbc16 = abc16List.get(abc16List.size() - 1);
        assertThat(testAbc16.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc16.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc16() throws Exception {
        int databaseSizeBeforeUpdate = abc16Repository.findAll().size();
        abc16.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc16MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc16.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc16))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc16() throws Exception {
        int databaseSizeBeforeUpdate = abc16Repository.findAll().size();
        abc16.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc16MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc16))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc16() throws Exception {
        int databaseSizeBeforeUpdate = abc16Repository.findAll().size();
        abc16.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc16MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc16))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc16 in the database
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc16() throws Exception {
        // Initialize the database
        abc16Repository.saveAndFlush(abc16);

        int databaseSizeBeforeDelete = abc16Repository.findAll().size();

        // Delete the abc16
        restAbc16MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc16.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc16> abc16List = abc16Repository.findAll();
        assertThat(abc16List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
