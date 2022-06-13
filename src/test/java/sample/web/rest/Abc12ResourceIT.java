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
import sample.domain.Abc12;
import sample.repository.Abc12Repository;

/**
 * Integration tests for the {@link Abc12Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc12ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-12-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc12Repository abc12Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc12MockMvc;

    private Abc12 abc12;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc12 createEntity(EntityManager em) {
        Abc12 abc12 = new Abc12().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc12;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc12 createUpdatedEntity(EntityManager em) {
        Abc12 abc12 = new Abc12().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc12;
    }

    @BeforeEach
    public void initTest() {
        abc12 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc12() throws Exception {
        int databaseSizeBeforeCreate = abc12Repository.findAll().size();
        // Create the Abc12
        restAbc12MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc12))
            )
            .andExpect(status().isCreated());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeCreate + 1);
        Abc12 testAbc12 = abc12List.get(abc12List.size() - 1);
        assertThat(testAbc12.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc12.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc12WithExistingId() throws Exception {
        // Create the Abc12 with an existing ID
        abc12.setId(1L);

        int databaseSizeBeforeCreate = abc12Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc12MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc12))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc12Repository.findAll().size();
        // set the field null
        abc12.setName(null);

        // Create the Abc12, which fails.

        restAbc12MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc12))
            )
            .andExpect(status().isBadRequest());

        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc12s() throws Exception {
        // Initialize the database
        abc12Repository.saveAndFlush(abc12);

        // Get all the abc12List
        restAbc12MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc12.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc12() throws Exception {
        // Initialize the database
        abc12Repository.saveAndFlush(abc12);

        // Get the abc12
        restAbc12MockMvc
            .perform(get(ENTITY_API_URL_ID, abc12.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc12.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc12() throws Exception {
        // Get the abc12
        restAbc12MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc12() throws Exception {
        // Initialize the database
        abc12Repository.saveAndFlush(abc12);

        int databaseSizeBeforeUpdate = abc12Repository.findAll().size();

        // Update the abc12
        Abc12 updatedAbc12 = abc12Repository.findById(abc12.getId()).get();
        // Disconnect from session so that the updates on updatedAbc12 are not directly saved in db
        em.detach(updatedAbc12);
        updatedAbc12.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc12MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc12.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc12))
            )
            .andExpect(status().isOk());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeUpdate);
        Abc12 testAbc12 = abc12List.get(abc12List.size() - 1);
        assertThat(testAbc12.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc12.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc12() throws Exception {
        int databaseSizeBeforeUpdate = abc12Repository.findAll().size();
        abc12.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc12MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc12.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc12))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc12() throws Exception {
        int databaseSizeBeforeUpdate = abc12Repository.findAll().size();
        abc12.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc12MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc12))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc12() throws Exception {
        int databaseSizeBeforeUpdate = abc12Repository.findAll().size();
        abc12.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc12MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc12))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc12WithPatch() throws Exception {
        // Initialize the database
        abc12Repository.saveAndFlush(abc12);

        int databaseSizeBeforeUpdate = abc12Repository.findAll().size();

        // Update the abc12 using partial update
        Abc12 partialUpdatedAbc12 = new Abc12();
        partialUpdatedAbc12.setId(abc12.getId());

        restAbc12MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc12.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc12))
            )
            .andExpect(status().isOk());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeUpdate);
        Abc12 testAbc12 = abc12List.get(abc12List.size() - 1);
        assertThat(testAbc12.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc12.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc12WithPatch() throws Exception {
        // Initialize the database
        abc12Repository.saveAndFlush(abc12);

        int databaseSizeBeforeUpdate = abc12Repository.findAll().size();

        // Update the abc12 using partial update
        Abc12 partialUpdatedAbc12 = new Abc12();
        partialUpdatedAbc12.setId(abc12.getId());

        partialUpdatedAbc12.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc12MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc12.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc12))
            )
            .andExpect(status().isOk());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeUpdate);
        Abc12 testAbc12 = abc12List.get(abc12List.size() - 1);
        assertThat(testAbc12.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc12.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc12() throws Exception {
        int databaseSizeBeforeUpdate = abc12Repository.findAll().size();
        abc12.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc12MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc12.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc12))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc12() throws Exception {
        int databaseSizeBeforeUpdate = abc12Repository.findAll().size();
        abc12.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc12MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc12))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc12() throws Exception {
        int databaseSizeBeforeUpdate = abc12Repository.findAll().size();
        abc12.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc12MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc12))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc12 in the database
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc12() throws Exception {
        // Initialize the database
        abc12Repository.saveAndFlush(abc12);

        int databaseSizeBeforeDelete = abc12Repository.findAll().size();

        // Delete the abc12
        restAbc12MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc12.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc12> abc12List = abc12Repository.findAll();
        assertThat(abc12List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
