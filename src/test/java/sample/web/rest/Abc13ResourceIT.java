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
import sample.domain.Abc13;
import sample.repository.Abc13Repository;

/**
 * Integration tests for the {@link Abc13Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc13ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-13-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc13Repository abc13Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc13MockMvc;

    private Abc13 abc13;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc13 createEntity(EntityManager em) {
        Abc13 abc13 = new Abc13().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc13;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc13 createUpdatedEntity(EntityManager em) {
        Abc13 abc13 = new Abc13().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc13;
    }

    @BeforeEach
    public void initTest() {
        abc13 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc13() throws Exception {
        int databaseSizeBeforeCreate = abc13Repository.findAll().size();
        // Create the Abc13
        restAbc13MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc13))
            )
            .andExpect(status().isCreated());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeCreate + 1);
        Abc13 testAbc13 = abc13List.get(abc13List.size() - 1);
        assertThat(testAbc13.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc13.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc13WithExistingId() throws Exception {
        // Create the Abc13 with an existing ID
        abc13.setId(1L);

        int databaseSizeBeforeCreate = abc13Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc13MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc13))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc13Repository.findAll().size();
        // set the field null
        abc13.setName(null);

        // Create the Abc13, which fails.

        restAbc13MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc13))
            )
            .andExpect(status().isBadRequest());

        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc13s() throws Exception {
        // Initialize the database
        abc13Repository.saveAndFlush(abc13);

        // Get all the abc13List
        restAbc13MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc13.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc13() throws Exception {
        // Initialize the database
        abc13Repository.saveAndFlush(abc13);

        // Get the abc13
        restAbc13MockMvc
            .perform(get(ENTITY_API_URL_ID, abc13.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc13.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc13() throws Exception {
        // Get the abc13
        restAbc13MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc13() throws Exception {
        // Initialize the database
        abc13Repository.saveAndFlush(abc13);

        int databaseSizeBeforeUpdate = abc13Repository.findAll().size();

        // Update the abc13
        Abc13 updatedAbc13 = abc13Repository.findById(abc13.getId()).get();
        // Disconnect from session so that the updates on updatedAbc13 are not directly saved in db
        em.detach(updatedAbc13);
        updatedAbc13.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc13MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc13.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc13))
            )
            .andExpect(status().isOk());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeUpdate);
        Abc13 testAbc13 = abc13List.get(abc13List.size() - 1);
        assertThat(testAbc13.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc13.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc13() throws Exception {
        int databaseSizeBeforeUpdate = abc13Repository.findAll().size();
        abc13.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc13MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc13.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc13))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc13() throws Exception {
        int databaseSizeBeforeUpdate = abc13Repository.findAll().size();
        abc13.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc13MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc13))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc13() throws Exception {
        int databaseSizeBeforeUpdate = abc13Repository.findAll().size();
        abc13.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc13MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc13))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc13WithPatch() throws Exception {
        // Initialize the database
        abc13Repository.saveAndFlush(abc13);

        int databaseSizeBeforeUpdate = abc13Repository.findAll().size();

        // Update the abc13 using partial update
        Abc13 partialUpdatedAbc13 = new Abc13();
        partialUpdatedAbc13.setId(abc13.getId());

        partialUpdatedAbc13.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc13MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc13.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc13))
            )
            .andExpect(status().isOk());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeUpdate);
        Abc13 testAbc13 = abc13List.get(abc13List.size() - 1);
        assertThat(testAbc13.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc13.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc13WithPatch() throws Exception {
        // Initialize the database
        abc13Repository.saveAndFlush(abc13);

        int databaseSizeBeforeUpdate = abc13Repository.findAll().size();

        // Update the abc13 using partial update
        Abc13 partialUpdatedAbc13 = new Abc13();
        partialUpdatedAbc13.setId(abc13.getId());

        partialUpdatedAbc13.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc13MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc13.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc13))
            )
            .andExpect(status().isOk());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeUpdate);
        Abc13 testAbc13 = abc13List.get(abc13List.size() - 1);
        assertThat(testAbc13.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc13.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc13() throws Exception {
        int databaseSizeBeforeUpdate = abc13Repository.findAll().size();
        abc13.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc13MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc13.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc13))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc13() throws Exception {
        int databaseSizeBeforeUpdate = abc13Repository.findAll().size();
        abc13.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc13MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc13))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc13() throws Exception {
        int databaseSizeBeforeUpdate = abc13Repository.findAll().size();
        abc13.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc13MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc13))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc13 in the database
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc13() throws Exception {
        // Initialize the database
        abc13Repository.saveAndFlush(abc13);

        int databaseSizeBeforeDelete = abc13Repository.findAll().size();

        // Delete the abc13
        restAbc13MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc13.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc13> abc13List = abc13Repository.findAll();
        assertThat(abc13List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
