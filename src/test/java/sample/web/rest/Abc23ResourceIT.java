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
import sample.domain.Abc23;
import sample.repository.Abc23Repository;

/**
 * Integration tests for the {@link Abc23Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc23ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-23-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc23Repository abc23Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc23MockMvc;

    private Abc23 abc23;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc23 createEntity(EntityManager em) {
        Abc23 abc23 = new Abc23().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc23;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc23 createUpdatedEntity(EntityManager em) {
        Abc23 abc23 = new Abc23().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc23;
    }

    @BeforeEach
    public void initTest() {
        abc23 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc23() throws Exception {
        int databaseSizeBeforeCreate = abc23Repository.findAll().size();
        // Create the Abc23
        restAbc23MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc23))
            )
            .andExpect(status().isCreated());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeCreate + 1);
        Abc23 testAbc23 = abc23List.get(abc23List.size() - 1);
        assertThat(testAbc23.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc23.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc23WithExistingId() throws Exception {
        // Create the Abc23 with an existing ID
        abc23.setId(1L);

        int databaseSizeBeforeCreate = abc23Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc23MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc23))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc23Repository.findAll().size();
        // set the field null
        abc23.setName(null);

        // Create the Abc23, which fails.

        restAbc23MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc23))
            )
            .andExpect(status().isBadRequest());

        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc23s() throws Exception {
        // Initialize the database
        abc23Repository.saveAndFlush(abc23);

        // Get all the abc23List
        restAbc23MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc23.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc23() throws Exception {
        // Initialize the database
        abc23Repository.saveAndFlush(abc23);

        // Get the abc23
        restAbc23MockMvc
            .perform(get(ENTITY_API_URL_ID, abc23.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc23.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc23() throws Exception {
        // Get the abc23
        restAbc23MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc23() throws Exception {
        // Initialize the database
        abc23Repository.saveAndFlush(abc23);

        int databaseSizeBeforeUpdate = abc23Repository.findAll().size();

        // Update the abc23
        Abc23 updatedAbc23 = abc23Repository.findById(abc23.getId()).get();
        // Disconnect from session so that the updates on updatedAbc23 are not directly saved in db
        em.detach(updatedAbc23);
        updatedAbc23.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc23MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc23.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc23))
            )
            .andExpect(status().isOk());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeUpdate);
        Abc23 testAbc23 = abc23List.get(abc23List.size() - 1);
        assertThat(testAbc23.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc23.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc23() throws Exception {
        int databaseSizeBeforeUpdate = abc23Repository.findAll().size();
        abc23.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc23MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc23.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc23))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc23() throws Exception {
        int databaseSizeBeforeUpdate = abc23Repository.findAll().size();
        abc23.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc23MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc23))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc23() throws Exception {
        int databaseSizeBeforeUpdate = abc23Repository.findAll().size();
        abc23.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc23MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc23))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc23WithPatch() throws Exception {
        // Initialize the database
        abc23Repository.saveAndFlush(abc23);

        int databaseSizeBeforeUpdate = abc23Repository.findAll().size();

        // Update the abc23 using partial update
        Abc23 partialUpdatedAbc23 = new Abc23();
        partialUpdatedAbc23.setId(abc23.getId());

        partialUpdatedAbc23.name(UPDATED_NAME);

        restAbc23MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc23.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc23))
            )
            .andExpect(status().isOk());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeUpdate);
        Abc23 testAbc23 = abc23List.get(abc23List.size() - 1);
        assertThat(testAbc23.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc23.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc23WithPatch() throws Exception {
        // Initialize the database
        abc23Repository.saveAndFlush(abc23);

        int databaseSizeBeforeUpdate = abc23Repository.findAll().size();

        // Update the abc23 using partial update
        Abc23 partialUpdatedAbc23 = new Abc23();
        partialUpdatedAbc23.setId(abc23.getId());

        partialUpdatedAbc23.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc23MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc23.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc23))
            )
            .andExpect(status().isOk());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeUpdate);
        Abc23 testAbc23 = abc23List.get(abc23List.size() - 1);
        assertThat(testAbc23.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc23.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc23() throws Exception {
        int databaseSizeBeforeUpdate = abc23Repository.findAll().size();
        abc23.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc23MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc23.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc23))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc23() throws Exception {
        int databaseSizeBeforeUpdate = abc23Repository.findAll().size();
        abc23.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc23MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc23))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc23() throws Exception {
        int databaseSizeBeforeUpdate = abc23Repository.findAll().size();
        abc23.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc23MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc23))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc23 in the database
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc23() throws Exception {
        // Initialize the database
        abc23Repository.saveAndFlush(abc23);

        int databaseSizeBeforeDelete = abc23Repository.findAll().size();

        // Delete the abc23
        restAbc23MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc23.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc23> abc23List = abc23Repository.findAll();
        assertThat(abc23List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
