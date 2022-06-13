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
import sample.domain.Abc17;
import sample.repository.Abc17Repository;

/**
 * Integration tests for the {@link Abc17Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc17ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-17-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc17Repository abc17Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc17MockMvc;

    private Abc17 abc17;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc17 createEntity(EntityManager em) {
        Abc17 abc17 = new Abc17().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc17;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc17 createUpdatedEntity(EntityManager em) {
        Abc17 abc17 = new Abc17().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc17;
    }

    @BeforeEach
    public void initTest() {
        abc17 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc17() throws Exception {
        int databaseSizeBeforeCreate = abc17Repository.findAll().size();
        // Create the Abc17
        restAbc17MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc17))
            )
            .andExpect(status().isCreated());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeCreate + 1);
        Abc17 testAbc17 = abc17List.get(abc17List.size() - 1);
        assertThat(testAbc17.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc17.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc17WithExistingId() throws Exception {
        // Create the Abc17 with an existing ID
        abc17.setId(1L);

        int databaseSizeBeforeCreate = abc17Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc17MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc17))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc17Repository.findAll().size();
        // set the field null
        abc17.setName(null);

        // Create the Abc17, which fails.

        restAbc17MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc17))
            )
            .andExpect(status().isBadRequest());

        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc17s() throws Exception {
        // Initialize the database
        abc17Repository.saveAndFlush(abc17);

        // Get all the abc17List
        restAbc17MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc17.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc17() throws Exception {
        // Initialize the database
        abc17Repository.saveAndFlush(abc17);

        // Get the abc17
        restAbc17MockMvc
            .perform(get(ENTITY_API_URL_ID, abc17.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc17.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc17() throws Exception {
        // Get the abc17
        restAbc17MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc17() throws Exception {
        // Initialize the database
        abc17Repository.saveAndFlush(abc17);

        int databaseSizeBeforeUpdate = abc17Repository.findAll().size();

        // Update the abc17
        Abc17 updatedAbc17 = abc17Repository.findById(abc17.getId()).get();
        // Disconnect from session so that the updates on updatedAbc17 are not directly saved in db
        em.detach(updatedAbc17);
        updatedAbc17.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc17MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc17.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc17))
            )
            .andExpect(status().isOk());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeUpdate);
        Abc17 testAbc17 = abc17List.get(abc17List.size() - 1);
        assertThat(testAbc17.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc17.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc17() throws Exception {
        int databaseSizeBeforeUpdate = abc17Repository.findAll().size();
        abc17.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc17MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc17.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc17))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc17() throws Exception {
        int databaseSizeBeforeUpdate = abc17Repository.findAll().size();
        abc17.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc17MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc17))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc17() throws Exception {
        int databaseSizeBeforeUpdate = abc17Repository.findAll().size();
        abc17.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc17MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc17))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc17WithPatch() throws Exception {
        // Initialize the database
        abc17Repository.saveAndFlush(abc17);

        int databaseSizeBeforeUpdate = abc17Repository.findAll().size();

        // Update the abc17 using partial update
        Abc17 partialUpdatedAbc17 = new Abc17();
        partialUpdatedAbc17.setId(abc17.getId());

        partialUpdatedAbc17.name(UPDATED_NAME);

        restAbc17MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc17.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc17))
            )
            .andExpect(status().isOk());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeUpdate);
        Abc17 testAbc17 = abc17List.get(abc17List.size() - 1);
        assertThat(testAbc17.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc17.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc17WithPatch() throws Exception {
        // Initialize the database
        abc17Repository.saveAndFlush(abc17);

        int databaseSizeBeforeUpdate = abc17Repository.findAll().size();

        // Update the abc17 using partial update
        Abc17 partialUpdatedAbc17 = new Abc17();
        partialUpdatedAbc17.setId(abc17.getId());

        partialUpdatedAbc17.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc17MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc17.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc17))
            )
            .andExpect(status().isOk());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeUpdate);
        Abc17 testAbc17 = abc17List.get(abc17List.size() - 1);
        assertThat(testAbc17.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc17.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc17() throws Exception {
        int databaseSizeBeforeUpdate = abc17Repository.findAll().size();
        abc17.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc17MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc17.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc17))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc17() throws Exception {
        int databaseSizeBeforeUpdate = abc17Repository.findAll().size();
        abc17.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc17MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc17))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc17() throws Exception {
        int databaseSizeBeforeUpdate = abc17Repository.findAll().size();
        abc17.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc17MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc17))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc17 in the database
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc17() throws Exception {
        // Initialize the database
        abc17Repository.saveAndFlush(abc17);

        int databaseSizeBeforeDelete = abc17Repository.findAll().size();

        // Delete the abc17
        restAbc17MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc17.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc17> abc17List = abc17Repository.findAll();
        assertThat(abc17List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
