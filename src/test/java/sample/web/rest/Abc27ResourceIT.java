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
import sample.domain.Abc27;
import sample.repository.Abc27Repository;

/**
 * Integration tests for the {@link Abc27Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc27ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-27-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc27Repository abc27Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc27MockMvc;

    private Abc27 abc27;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc27 createEntity(EntityManager em) {
        Abc27 abc27 = new Abc27().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc27;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc27 createUpdatedEntity(EntityManager em) {
        Abc27 abc27 = new Abc27().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc27;
    }

    @BeforeEach
    public void initTest() {
        abc27 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc27() throws Exception {
        int databaseSizeBeforeCreate = abc27Repository.findAll().size();
        // Create the Abc27
        restAbc27MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc27))
            )
            .andExpect(status().isCreated());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeCreate + 1);
        Abc27 testAbc27 = abc27List.get(abc27List.size() - 1);
        assertThat(testAbc27.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc27.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc27WithExistingId() throws Exception {
        // Create the Abc27 with an existing ID
        abc27.setId(1L);

        int databaseSizeBeforeCreate = abc27Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc27MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc27))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc27Repository.findAll().size();
        // set the field null
        abc27.setName(null);

        // Create the Abc27, which fails.

        restAbc27MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc27))
            )
            .andExpect(status().isBadRequest());

        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc27s() throws Exception {
        // Initialize the database
        abc27Repository.saveAndFlush(abc27);

        // Get all the abc27List
        restAbc27MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc27.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc27() throws Exception {
        // Initialize the database
        abc27Repository.saveAndFlush(abc27);

        // Get the abc27
        restAbc27MockMvc
            .perform(get(ENTITY_API_URL_ID, abc27.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc27.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc27() throws Exception {
        // Get the abc27
        restAbc27MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc27() throws Exception {
        // Initialize the database
        abc27Repository.saveAndFlush(abc27);

        int databaseSizeBeforeUpdate = abc27Repository.findAll().size();

        // Update the abc27
        Abc27 updatedAbc27 = abc27Repository.findById(abc27.getId()).get();
        // Disconnect from session so that the updates on updatedAbc27 are not directly saved in db
        em.detach(updatedAbc27);
        updatedAbc27.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc27MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc27.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc27))
            )
            .andExpect(status().isOk());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeUpdate);
        Abc27 testAbc27 = abc27List.get(abc27List.size() - 1);
        assertThat(testAbc27.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc27.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc27() throws Exception {
        int databaseSizeBeforeUpdate = abc27Repository.findAll().size();
        abc27.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc27MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc27.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc27))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc27() throws Exception {
        int databaseSizeBeforeUpdate = abc27Repository.findAll().size();
        abc27.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc27MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc27))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc27() throws Exception {
        int databaseSizeBeforeUpdate = abc27Repository.findAll().size();
        abc27.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc27MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc27))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc27WithPatch() throws Exception {
        // Initialize the database
        abc27Repository.saveAndFlush(abc27);

        int databaseSizeBeforeUpdate = abc27Repository.findAll().size();

        // Update the abc27 using partial update
        Abc27 partialUpdatedAbc27 = new Abc27();
        partialUpdatedAbc27.setId(abc27.getId());

        partialUpdatedAbc27.name(UPDATED_NAME);

        restAbc27MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc27.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc27))
            )
            .andExpect(status().isOk());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeUpdate);
        Abc27 testAbc27 = abc27List.get(abc27List.size() - 1);
        assertThat(testAbc27.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc27.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc27WithPatch() throws Exception {
        // Initialize the database
        abc27Repository.saveAndFlush(abc27);

        int databaseSizeBeforeUpdate = abc27Repository.findAll().size();

        // Update the abc27 using partial update
        Abc27 partialUpdatedAbc27 = new Abc27();
        partialUpdatedAbc27.setId(abc27.getId());

        partialUpdatedAbc27.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc27MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc27.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc27))
            )
            .andExpect(status().isOk());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeUpdate);
        Abc27 testAbc27 = abc27List.get(abc27List.size() - 1);
        assertThat(testAbc27.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc27.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc27() throws Exception {
        int databaseSizeBeforeUpdate = abc27Repository.findAll().size();
        abc27.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc27MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc27.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc27))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc27() throws Exception {
        int databaseSizeBeforeUpdate = abc27Repository.findAll().size();
        abc27.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc27MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc27))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc27() throws Exception {
        int databaseSizeBeforeUpdate = abc27Repository.findAll().size();
        abc27.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc27MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc27))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc27 in the database
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc27() throws Exception {
        // Initialize the database
        abc27Repository.saveAndFlush(abc27);

        int databaseSizeBeforeDelete = abc27Repository.findAll().size();

        // Delete the abc27
        restAbc27MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc27.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc27> abc27List = abc27Repository.findAll();
        assertThat(abc27List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
