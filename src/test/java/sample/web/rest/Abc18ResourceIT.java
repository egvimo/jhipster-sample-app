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
import sample.domain.Abc18;
import sample.repository.Abc18Repository;

/**
 * Integration tests for the {@link Abc18Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc18ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-18-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc18Repository abc18Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc18MockMvc;

    private Abc18 abc18;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc18 createEntity(EntityManager em) {
        Abc18 abc18 = new Abc18().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc18;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc18 createUpdatedEntity(EntityManager em) {
        Abc18 abc18 = new Abc18().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc18;
    }

    @BeforeEach
    public void initTest() {
        abc18 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc18() throws Exception {
        int databaseSizeBeforeCreate = abc18Repository.findAll().size();
        // Create the Abc18
        restAbc18MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc18))
            )
            .andExpect(status().isCreated());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeCreate + 1);
        Abc18 testAbc18 = abc18List.get(abc18List.size() - 1);
        assertThat(testAbc18.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc18.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc18WithExistingId() throws Exception {
        // Create the Abc18 with an existing ID
        abc18.setId(1L);

        int databaseSizeBeforeCreate = abc18Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc18MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc18))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc18Repository.findAll().size();
        // set the field null
        abc18.setName(null);

        // Create the Abc18, which fails.

        restAbc18MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc18))
            )
            .andExpect(status().isBadRequest());

        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc18s() throws Exception {
        // Initialize the database
        abc18Repository.saveAndFlush(abc18);

        // Get all the abc18List
        restAbc18MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc18.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc18() throws Exception {
        // Initialize the database
        abc18Repository.saveAndFlush(abc18);

        // Get the abc18
        restAbc18MockMvc
            .perform(get(ENTITY_API_URL_ID, abc18.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc18.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc18() throws Exception {
        // Get the abc18
        restAbc18MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc18() throws Exception {
        // Initialize the database
        abc18Repository.saveAndFlush(abc18);

        int databaseSizeBeforeUpdate = abc18Repository.findAll().size();

        // Update the abc18
        Abc18 updatedAbc18 = abc18Repository.findById(abc18.getId()).get();
        // Disconnect from session so that the updates on updatedAbc18 are not directly saved in db
        em.detach(updatedAbc18);
        updatedAbc18.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc18MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc18.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc18))
            )
            .andExpect(status().isOk());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeUpdate);
        Abc18 testAbc18 = abc18List.get(abc18List.size() - 1);
        assertThat(testAbc18.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc18.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc18() throws Exception {
        int databaseSizeBeforeUpdate = abc18Repository.findAll().size();
        abc18.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc18MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc18.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc18))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc18() throws Exception {
        int databaseSizeBeforeUpdate = abc18Repository.findAll().size();
        abc18.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc18MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc18))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc18() throws Exception {
        int databaseSizeBeforeUpdate = abc18Repository.findAll().size();
        abc18.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc18MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc18))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc18WithPatch() throws Exception {
        // Initialize the database
        abc18Repository.saveAndFlush(abc18);

        int databaseSizeBeforeUpdate = abc18Repository.findAll().size();

        // Update the abc18 using partial update
        Abc18 partialUpdatedAbc18 = new Abc18();
        partialUpdatedAbc18.setId(abc18.getId());

        partialUpdatedAbc18.name(UPDATED_NAME);

        restAbc18MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc18.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc18))
            )
            .andExpect(status().isOk());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeUpdate);
        Abc18 testAbc18 = abc18List.get(abc18List.size() - 1);
        assertThat(testAbc18.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc18.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc18WithPatch() throws Exception {
        // Initialize the database
        abc18Repository.saveAndFlush(abc18);

        int databaseSizeBeforeUpdate = abc18Repository.findAll().size();

        // Update the abc18 using partial update
        Abc18 partialUpdatedAbc18 = new Abc18();
        partialUpdatedAbc18.setId(abc18.getId());

        partialUpdatedAbc18.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc18MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc18.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc18))
            )
            .andExpect(status().isOk());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeUpdate);
        Abc18 testAbc18 = abc18List.get(abc18List.size() - 1);
        assertThat(testAbc18.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc18.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc18() throws Exception {
        int databaseSizeBeforeUpdate = abc18Repository.findAll().size();
        abc18.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc18MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc18.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc18))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc18() throws Exception {
        int databaseSizeBeforeUpdate = abc18Repository.findAll().size();
        abc18.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc18MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc18))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc18() throws Exception {
        int databaseSizeBeforeUpdate = abc18Repository.findAll().size();
        abc18.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc18MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc18))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc18 in the database
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc18() throws Exception {
        // Initialize the database
        abc18Repository.saveAndFlush(abc18);

        int databaseSizeBeforeDelete = abc18Repository.findAll().size();

        // Delete the abc18
        restAbc18MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc18.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc18> abc18List = abc18Repository.findAll();
        assertThat(abc18List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
