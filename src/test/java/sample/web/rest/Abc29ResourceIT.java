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
import sample.domain.Abc29;
import sample.repository.Abc29Repository;

/**
 * Integration tests for the {@link Abc29Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc29ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-29-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc29Repository abc29Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc29MockMvc;

    private Abc29 abc29;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc29 createEntity(EntityManager em) {
        Abc29 abc29 = new Abc29().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc29;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc29 createUpdatedEntity(EntityManager em) {
        Abc29 abc29 = new Abc29().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc29;
    }

    @BeforeEach
    public void initTest() {
        abc29 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc29() throws Exception {
        int databaseSizeBeforeCreate = abc29Repository.findAll().size();
        // Create the Abc29
        restAbc29MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc29))
            )
            .andExpect(status().isCreated());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeCreate + 1);
        Abc29 testAbc29 = abc29List.get(abc29List.size() - 1);
        assertThat(testAbc29.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc29.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc29WithExistingId() throws Exception {
        // Create the Abc29 with an existing ID
        abc29.setId(1L);

        int databaseSizeBeforeCreate = abc29Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc29MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc29))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc29Repository.findAll().size();
        // set the field null
        abc29.setName(null);

        // Create the Abc29, which fails.

        restAbc29MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc29))
            )
            .andExpect(status().isBadRequest());

        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc29s() throws Exception {
        // Initialize the database
        abc29Repository.saveAndFlush(abc29);

        // Get all the abc29List
        restAbc29MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc29.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc29() throws Exception {
        // Initialize the database
        abc29Repository.saveAndFlush(abc29);

        // Get the abc29
        restAbc29MockMvc
            .perform(get(ENTITY_API_URL_ID, abc29.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc29.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc29() throws Exception {
        // Get the abc29
        restAbc29MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc29() throws Exception {
        // Initialize the database
        abc29Repository.saveAndFlush(abc29);

        int databaseSizeBeforeUpdate = abc29Repository.findAll().size();

        // Update the abc29
        Abc29 updatedAbc29 = abc29Repository.findById(abc29.getId()).get();
        // Disconnect from session so that the updates on updatedAbc29 are not directly saved in db
        em.detach(updatedAbc29);
        updatedAbc29.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc29MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc29.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc29))
            )
            .andExpect(status().isOk());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeUpdate);
        Abc29 testAbc29 = abc29List.get(abc29List.size() - 1);
        assertThat(testAbc29.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc29.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc29() throws Exception {
        int databaseSizeBeforeUpdate = abc29Repository.findAll().size();
        abc29.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc29MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc29.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc29))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc29() throws Exception {
        int databaseSizeBeforeUpdate = abc29Repository.findAll().size();
        abc29.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc29MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc29))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc29() throws Exception {
        int databaseSizeBeforeUpdate = abc29Repository.findAll().size();
        abc29.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc29MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc29))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc29WithPatch() throws Exception {
        // Initialize the database
        abc29Repository.saveAndFlush(abc29);

        int databaseSizeBeforeUpdate = abc29Repository.findAll().size();

        // Update the abc29 using partial update
        Abc29 partialUpdatedAbc29 = new Abc29();
        partialUpdatedAbc29.setId(abc29.getId());

        partialUpdatedAbc29.name(UPDATED_NAME);

        restAbc29MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc29.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc29))
            )
            .andExpect(status().isOk());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeUpdate);
        Abc29 testAbc29 = abc29List.get(abc29List.size() - 1);
        assertThat(testAbc29.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc29.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc29WithPatch() throws Exception {
        // Initialize the database
        abc29Repository.saveAndFlush(abc29);

        int databaseSizeBeforeUpdate = abc29Repository.findAll().size();

        // Update the abc29 using partial update
        Abc29 partialUpdatedAbc29 = new Abc29();
        partialUpdatedAbc29.setId(abc29.getId());

        partialUpdatedAbc29.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc29MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc29.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc29))
            )
            .andExpect(status().isOk());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeUpdate);
        Abc29 testAbc29 = abc29List.get(abc29List.size() - 1);
        assertThat(testAbc29.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc29.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc29() throws Exception {
        int databaseSizeBeforeUpdate = abc29Repository.findAll().size();
        abc29.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc29MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc29.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc29))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc29() throws Exception {
        int databaseSizeBeforeUpdate = abc29Repository.findAll().size();
        abc29.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc29MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc29))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc29() throws Exception {
        int databaseSizeBeforeUpdate = abc29Repository.findAll().size();
        abc29.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc29MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc29))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc29 in the database
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc29() throws Exception {
        // Initialize the database
        abc29Repository.saveAndFlush(abc29);

        int databaseSizeBeforeDelete = abc29Repository.findAll().size();

        // Delete the abc29
        restAbc29MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc29.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc29> abc29List = abc29Repository.findAll();
        assertThat(abc29List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
