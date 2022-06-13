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
import sample.domain.Abc14;
import sample.repository.Abc14Repository;

/**
 * Integration tests for the {@link Abc14Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc14ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-14-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc14Repository abc14Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc14MockMvc;

    private Abc14 abc14;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc14 createEntity(EntityManager em) {
        Abc14 abc14 = new Abc14().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc14;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc14 createUpdatedEntity(EntityManager em) {
        Abc14 abc14 = new Abc14().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc14;
    }

    @BeforeEach
    public void initTest() {
        abc14 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc14() throws Exception {
        int databaseSizeBeforeCreate = abc14Repository.findAll().size();
        // Create the Abc14
        restAbc14MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc14))
            )
            .andExpect(status().isCreated());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeCreate + 1);
        Abc14 testAbc14 = abc14List.get(abc14List.size() - 1);
        assertThat(testAbc14.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc14.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc14WithExistingId() throws Exception {
        // Create the Abc14 with an existing ID
        abc14.setId(1L);

        int databaseSizeBeforeCreate = abc14Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc14MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc14))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc14Repository.findAll().size();
        // set the field null
        abc14.setName(null);

        // Create the Abc14, which fails.

        restAbc14MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc14))
            )
            .andExpect(status().isBadRequest());

        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc14s() throws Exception {
        // Initialize the database
        abc14Repository.saveAndFlush(abc14);

        // Get all the abc14List
        restAbc14MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc14.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc14() throws Exception {
        // Initialize the database
        abc14Repository.saveAndFlush(abc14);

        // Get the abc14
        restAbc14MockMvc
            .perform(get(ENTITY_API_URL_ID, abc14.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc14.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc14() throws Exception {
        // Get the abc14
        restAbc14MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc14() throws Exception {
        // Initialize the database
        abc14Repository.saveAndFlush(abc14);

        int databaseSizeBeforeUpdate = abc14Repository.findAll().size();

        // Update the abc14
        Abc14 updatedAbc14 = abc14Repository.findById(abc14.getId()).get();
        // Disconnect from session so that the updates on updatedAbc14 are not directly saved in db
        em.detach(updatedAbc14);
        updatedAbc14.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc14MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc14.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc14))
            )
            .andExpect(status().isOk());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeUpdate);
        Abc14 testAbc14 = abc14List.get(abc14List.size() - 1);
        assertThat(testAbc14.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc14.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc14() throws Exception {
        int databaseSizeBeforeUpdate = abc14Repository.findAll().size();
        abc14.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc14MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc14.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc14))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc14() throws Exception {
        int databaseSizeBeforeUpdate = abc14Repository.findAll().size();
        abc14.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc14MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc14))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc14() throws Exception {
        int databaseSizeBeforeUpdate = abc14Repository.findAll().size();
        abc14.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc14MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc14))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc14WithPatch() throws Exception {
        // Initialize the database
        abc14Repository.saveAndFlush(abc14);

        int databaseSizeBeforeUpdate = abc14Repository.findAll().size();

        // Update the abc14 using partial update
        Abc14 partialUpdatedAbc14 = new Abc14();
        partialUpdatedAbc14.setId(abc14.getId());

        partialUpdatedAbc14.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc14MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc14.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc14))
            )
            .andExpect(status().isOk());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeUpdate);
        Abc14 testAbc14 = abc14List.get(abc14List.size() - 1);
        assertThat(testAbc14.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc14.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc14WithPatch() throws Exception {
        // Initialize the database
        abc14Repository.saveAndFlush(abc14);

        int databaseSizeBeforeUpdate = abc14Repository.findAll().size();

        // Update the abc14 using partial update
        Abc14 partialUpdatedAbc14 = new Abc14();
        partialUpdatedAbc14.setId(abc14.getId());

        partialUpdatedAbc14.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc14MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc14.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc14))
            )
            .andExpect(status().isOk());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeUpdate);
        Abc14 testAbc14 = abc14List.get(abc14List.size() - 1);
        assertThat(testAbc14.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc14.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc14() throws Exception {
        int databaseSizeBeforeUpdate = abc14Repository.findAll().size();
        abc14.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc14MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc14.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc14))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc14() throws Exception {
        int databaseSizeBeforeUpdate = abc14Repository.findAll().size();
        abc14.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc14MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc14))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc14() throws Exception {
        int databaseSizeBeforeUpdate = abc14Repository.findAll().size();
        abc14.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc14MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc14))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc14 in the database
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc14() throws Exception {
        // Initialize the database
        abc14Repository.saveAndFlush(abc14);

        int databaseSizeBeforeDelete = abc14Repository.findAll().size();

        // Delete the abc14
        restAbc14MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc14.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc14> abc14List = abc14Repository.findAll();
        assertThat(abc14List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
