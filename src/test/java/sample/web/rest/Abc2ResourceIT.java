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
import sample.domain.Abc2;
import sample.repository.Abc2Repository;

/**
 * Integration tests for the {@link Abc2Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc2ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-2-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc2Repository abc2Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc2MockMvc;

    private Abc2 abc2;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc2 createEntity(EntityManager em) {
        Abc2 abc2 = new Abc2().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc2;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc2 createUpdatedEntity(EntityManager em) {
        Abc2 abc2 = new Abc2().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc2;
    }

    @BeforeEach
    public void initTest() {
        abc2 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc2() throws Exception {
        int databaseSizeBeforeCreate = abc2Repository.findAll().size();
        // Create the Abc2
        restAbc2MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc2))
            )
            .andExpect(status().isCreated());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeCreate + 1);
        Abc2 testAbc2 = abc2List.get(abc2List.size() - 1);
        assertThat(testAbc2.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc2.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc2WithExistingId() throws Exception {
        // Create the Abc2 with an existing ID
        abc2.setId(1L);

        int databaseSizeBeforeCreate = abc2Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc2MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc2))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc2Repository.findAll().size();
        // set the field null
        abc2.setName(null);

        // Create the Abc2, which fails.

        restAbc2MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc2))
            )
            .andExpect(status().isBadRequest());

        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc2s() throws Exception {
        // Initialize the database
        abc2Repository.saveAndFlush(abc2);

        // Get all the abc2List
        restAbc2MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc2.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc2() throws Exception {
        // Initialize the database
        abc2Repository.saveAndFlush(abc2);

        // Get the abc2
        restAbc2MockMvc
            .perform(get(ENTITY_API_URL_ID, abc2.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc2.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc2() throws Exception {
        // Get the abc2
        restAbc2MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc2() throws Exception {
        // Initialize the database
        abc2Repository.saveAndFlush(abc2);

        int databaseSizeBeforeUpdate = abc2Repository.findAll().size();

        // Update the abc2
        Abc2 updatedAbc2 = abc2Repository.findById(abc2.getId()).get();
        // Disconnect from session so that the updates on updatedAbc2 are not directly saved in db
        em.detach(updatedAbc2);
        updatedAbc2.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc2MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc2.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc2))
            )
            .andExpect(status().isOk());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeUpdate);
        Abc2 testAbc2 = abc2List.get(abc2List.size() - 1);
        assertThat(testAbc2.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc2.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc2() throws Exception {
        int databaseSizeBeforeUpdate = abc2Repository.findAll().size();
        abc2.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc2MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc2.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc2))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc2() throws Exception {
        int databaseSizeBeforeUpdate = abc2Repository.findAll().size();
        abc2.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc2MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc2))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc2() throws Exception {
        int databaseSizeBeforeUpdate = abc2Repository.findAll().size();
        abc2.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc2MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc2))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc2WithPatch() throws Exception {
        // Initialize the database
        abc2Repository.saveAndFlush(abc2);

        int databaseSizeBeforeUpdate = abc2Repository.findAll().size();

        // Update the abc2 using partial update
        Abc2 partialUpdatedAbc2 = new Abc2();
        partialUpdatedAbc2.setId(abc2.getId());

        partialUpdatedAbc2.name(UPDATED_NAME);

        restAbc2MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc2.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc2))
            )
            .andExpect(status().isOk());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeUpdate);
        Abc2 testAbc2 = abc2List.get(abc2List.size() - 1);
        assertThat(testAbc2.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc2.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc2WithPatch() throws Exception {
        // Initialize the database
        abc2Repository.saveAndFlush(abc2);

        int databaseSizeBeforeUpdate = abc2Repository.findAll().size();

        // Update the abc2 using partial update
        Abc2 partialUpdatedAbc2 = new Abc2();
        partialUpdatedAbc2.setId(abc2.getId());

        partialUpdatedAbc2.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc2MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc2.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc2))
            )
            .andExpect(status().isOk());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeUpdate);
        Abc2 testAbc2 = abc2List.get(abc2List.size() - 1);
        assertThat(testAbc2.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc2.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc2() throws Exception {
        int databaseSizeBeforeUpdate = abc2Repository.findAll().size();
        abc2.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc2MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc2.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc2))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc2() throws Exception {
        int databaseSizeBeforeUpdate = abc2Repository.findAll().size();
        abc2.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc2MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc2))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc2() throws Exception {
        int databaseSizeBeforeUpdate = abc2Repository.findAll().size();
        abc2.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc2MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc2))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc2 in the database
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc2() throws Exception {
        // Initialize the database
        abc2Repository.saveAndFlush(abc2);

        int databaseSizeBeforeDelete = abc2Repository.findAll().size();

        // Delete the abc2
        restAbc2MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc2.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc2> abc2List = abc2Repository.findAll();
        assertThat(abc2List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
