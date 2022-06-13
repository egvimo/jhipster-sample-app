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
import sample.domain.Abc0;
import sample.repository.Abc0Repository;

/**
 * Integration tests for the {@link Abc0Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc0ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-0-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc0Repository abc0Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc0MockMvc;

    private Abc0 abc0;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc0 createEntity(EntityManager em) {
        Abc0 abc0 = new Abc0().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc0;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc0 createUpdatedEntity(EntityManager em) {
        Abc0 abc0 = new Abc0().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc0;
    }

    @BeforeEach
    public void initTest() {
        abc0 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc0() throws Exception {
        int databaseSizeBeforeCreate = abc0Repository.findAll().size();
        // Create the Abc0
        restAbc0MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc0))
            )
            .andExpect(status().isCreated());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeCreate + 1);
        Abc0 testAbc0 = abc0List.get(abc0List.size() - 1);
        assertThat(testAbc0.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc0.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc0WithExistingId() throws Exception {
        // Create the Abc0 with an existing ID
        abc0.setId(1L);

        int databaseSizeBeforeCreate = abc0Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc0MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc0))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc0Repository.findAll().size();
        // set the field null
        abc0.setName(null);

        // Create the Abc0, which fails.

        restAbc0MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc0))
            )
            .andExpect(status().isBadRequest());

        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc0s() throws Exception {
        // Initialize the database
        abc0Repository.saveAndFlush(abc0);

        // Get all the abc0List
        restAbc0MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc0.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc0() throws Exception {
        // Initialize the database
        abc0Repository.saveAndFlush(abc0);

        // Get the abc0
        restAbc0MockMvc
            .perform(get(ENTITY_API_URL_ID, abc0.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc0.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc0() throws Exception {
        // Get the abc0
        restAbc0MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc0() throws Exception {
        // Initialize the database
        abc0Repository.saveAndFlush(abc0);

        int databaseSizeBeforeUpdate = abc0Repository.findAll().size();

        // Update the abc0
        Abc0 updatedAbc0 = abc0Repository.findById(abc0.getId()).get();
        // Disconnect from session so that the updates on updatedAbc0 are not directly saved in db
        em.detach(updatedAbc0);
        updatedAbc0.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc0MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc0.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc0))
            )
            .andExpect(status().isOk());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeUpdate);
        Abc0 testAbc0 = abc0List.get(abc0List.size() - 1);
        assertThat(testAbc0.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc0.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc0() throws Exception {
        int databaseSizeBeforeUpdate = abc0Repository.findAll().size();
        abc0.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc0MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc0.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc0))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc0() throws Exception {
        int databaseSizeBeforeUpdate = abc0Repository.findAll().size();
        abc0.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc0MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc0))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc0() throws Exception {
        int databaseSizeBeforeUpdate = abc0Repository.findAll().size();
        abc0.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc0MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc0))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc0WithPatch() throws Exception {
        // Initialize the database
        abc0Repository.saveAndFlush(abc0);

        int databaseSizeBeforeUpdate = abc0Repository.findAll().size();

        // Update the abc0 using partial update
        Abc0 partialUpdatedAbc0 = new Abc0();
        partialUpdatedAbc0.setId(abc0.getId());

        restAbc0MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc0.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc0))
            )
            .andExpect(status().isOk());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeUpdate);
        Abc0 testAbc0 = abc0List.get(abc0List.size() - 1);
        assertThat(testAbc0.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc0.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc0WithPatch() throws Exception {
        // Initialize the database
        abc0Repository.saveAndFlush(abc0);

        int databaseSizeBeforeUpdate = abc0Repository.findAll().size();

        // Update the abc0 using partial update
        Abc0 partialUpdatedAbc0 = new Abc0();
        partialUpdatedAbc0.setId(abc0.getId());

        partialUpdatedAbc0.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc0MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc0.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc0))
            )
            .andExpect(status().isOk());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeUpdate);
        Abc0 testAbc0 = abc0List.get(abc0List.size() - 1);
        assertThat(testAbc0.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc0.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc0() throws Exception {
        int databaseSizeBeforeUpdate = abc0Repository.findAll().size();
        abc0.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc0MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc0.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc0))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc0() throws Exception {
        int databaseSizeBeforeUpdate = abc0Repository.findAll().size();
        abc0.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc0MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc0))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc0() throws Exception {
        int databaseSizeBeforeUpdate = abc0Repository.findAll().size();
        abc0.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc0MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc0))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc0 in the database
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc0() throws Exception {
        // Initialize the database
        abc0Repository.saveAndFlush(abc0);

        int databaseSizeBeforeDelete = abc0Repository.findAll().size();

        // Delete the abc0
        restAbc0MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc0.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc0> abc0List = abc0Repository.findAll();
        assertThat(abc0List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
