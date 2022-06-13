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
import sample.domain.Abc24;
import sample.repository.Abc24Repository;

/**
 * Integration tests for the {@link Abc24Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc24ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-24-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc24Repository abc24Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc24MockMvc;

    private Abc24 abc24;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc24 createEntity(EntityManager em) {
        Abc24 abc24 = new Abc24().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc24;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc24 createUpdatedEntity(EntityManager em) {
        Abc24 abc24 = new Abc24().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc24;
    }

    @BeforeEach
    public void initTest() {
        abc24 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc24() throws Exception {
        int databaseSizeBeforeCreate = abc24Repository.findAll().size();
        // Create the Abc24
        restAbc24MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc24))
            )
            .andExpect(status().isCreated());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeCreate + 1);
        Abc24 testAbc24 = abc24List.get(abc24List.size() - 1);
        assertThat(testAbc24.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc24.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc24WithExistingId() throws Exception {
        // Create the Abc24 with an existing ID
        abc24.setId(1L);

        int databaseSizeBeforeCreate = abc24Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc24MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc24))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc24Repository.findAll().size();
        // set the field null
        abc24.setName(null);

        // Create the Abc24, which fails.

        restAbc24MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc24))
            )
            .andExpect(status().isBadRequest());

        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc24s() throws Exception {
        // Initialize the database
        abc24Repository.saveAndFlush(abc24);

        // Get all the abc24List
        restAbc24MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc24.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc24() throws Exception {
        // Initialize the database
        abc24Repository.saveAndFlush(abc24);

        // Get the abc24
        restAbc24MockMvc
            .perform(get(ENTITY_API_URL_ID, abc24.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc24.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc24() throws Exception {
        // Get the abc24
        restAbc24MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc24() throws Exception {
        // Initialize the database
        abc24Repository.saveAndFlush(abc24);

        int databaseSizeBeforeUpdate = abc24Repository.findAll().size();

        // Update the abc24
        Abc24 updatedAbc24 = abc24Repository.findById(abc24.getId()).get();
        // Disconnect from session so that the updates on updatedAbc24 are not directly saved in db
        em.detach(updatedAbc24);
        updatedAbc24.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc24MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc24.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc24))
            )
            .andExpect(status().isOk());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeUpdate);
        Abc24 testAbc24 = abc24List.get(abc24List.size() - 1);
        assertThat(testAbc24.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc24.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc24() throws Exception {
        int databaseSizeBeforeUpdate = abc24Repository.findAll().size();
        abc24.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc24MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc24.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc24))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc24() throws Exception {
        int databaseSizeBeforeUpdate = abc24Repository.findAll().size();
        abc24.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc24MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc24))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc24() throws Exception {
        int databaseSizeBeforeUpdate = abc24Repository.findAll().size();
        abc24.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc24MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc24))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc24WithPatch() throws Exception {
        // Initialize the database
        abc24Repository.saveAndFlush(abc24);

        int databaseSizeBeforeUpdate = abc24Repository.findAll().size();

        // Update the abc24 using partial update
        Abc24 partialUpdatedAbc24 = new Abc24();
        partialUpdatedAbc24.setId(abc24.getId());

        partialUpdatedAbc24.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc24MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc24.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc24))
            )
            .andExpect(status().isOk());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeUpdate);
        Abc24 testAbc24 = abc24List.get(abc24List.size() - 1);
        assertThat(testAbc24.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc24.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc24WithPatch() throws Exception {
        // Initialize the database
        abc24Repository.saveAndFlush(abc24);

        int databaseSizeBeforeUpdate = abc24Repository.findAll().size();

        // Update the abc24 using partial update
        Abc24 partialUpdatedAbc24 = new Abc24();
        partialUpdatedAbc24.setId(abc24.getId());

        partialUpdatedAbc24.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc24MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc24.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc24))
            )
            .andExpect(status().isOk());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeUpdate);
        Abc24 testAbc24 = abc24List.get(abc24List.size() - 1);
        assertThat(testAbc24.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc24.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc24() throws Exception {
        int databaseSizeBeforeUpdate = abc24Repository.findAll().size();
        abc24.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc24MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc24.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc24))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc24() throws Exception {
        int databaseSizeBeforeUpdate = abc24Repository.findAll().size();
        abc24.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc24MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc24))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc24() throws Exception {
        int databaseSizeBeforeUpdate = abc24Repository.findAll().size();
        abc24.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc24MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc24))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc24 in the database
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc24() throws Exception {
        // Initialize the database
        abc24Repository.saveAndFlush(abc24);

        int databaseSizeBeforeDelete = abc24Repository.findAll().size();

        // Delete the abc24
        restAbc24MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc24.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc24> abc24List = abc24Repository.findAll();
        assertThat(abc24List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
