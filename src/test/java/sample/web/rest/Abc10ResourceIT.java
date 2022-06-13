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
import sample.domain.Abc10;
import sample.repository.Abc10Repository;

/**
 * Integration tests for the {@link Abc10Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc10ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-10-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc10Repository abc10Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc10MockMvc;

    private Abc10 abc10;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc10 createEntity(EntityManager em) {
        Abc10 abc10 = new Abc10().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc10;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc10 createUpdatedEntity(EntityManager em) {
        Abc10 abc10 = new Abc10().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc10;
    }

    @BeforeEach
    public void initTest() {
        abc10 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc10() throws Exception {
        int databaseSizeBeforeCreate = abc10Repository.findAll().size();
        // Create the Abc10
        restAbc10MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc10))
            )
            .andExpect(status().isCreated());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeCreate + 1);
        Abc10 testAbc10 = abc10List.get(abc10List.size() - 1);
        assertThat(testAbc10.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc10.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc10WithExistingId() throws Exception {
        // Create the Abc10 with an existing ID
        abc10.setId(1L);

        int databaseSizeBeforeCreate = abc10Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc10MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc10))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc10Repository.findAll().size();
        // set the field null
        abc10.setName(null);

        // Create the Abc10, which fails.

        restAbc10MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc10))
            )
            .andExpect(status().isBadRequest());

        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc10s() throws Exception {
        // Initialize the database
        abc10Repository.saveAndFlush(abc10);

        // Get all the abc10List
        restAbc10MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc10.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc10() throws Exception {
        // Initialize the database
        abc10Repository.saveAndFlush(abc10);

        // Get the abc10
        restAbc10MockMvc
            .perform(get(ENTITY_API_URL_ID, abc10.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc10.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc10() throws Exception {
        // Get the abc10
        restAbc10MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc10() throws Exception {
        // Initialize the database
        abc10Repository.saveAndFlush(abc10);

        int databaseSizeBeforeUpdate = abc10Repository.findAll().size();

        // Update the abc10
        Abc10 updatedAbc10 = abc10Repository.findById(abc10.getId()).get();
        // Disconnect from session so that the updates on updatedAbc10 are not directly saved in db
        em.detach(updatedAbc10);
        updatedAbc10.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc10MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc10.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc10))
            )
            .andExpect(status().isOk());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeUpdate);
        Abc10 testAbc10 = abc10List.get(abc10List.size() - 1);
        assertThat(testAbc10.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc10.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc10() throws Exception {
        int databaseSizeBeforeUpdate = abc10Repository.findAll().size();
        abc10.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc10MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc10.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc10))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc10() throws Exception {
        int databaseSizeBeforeUpdate = abc10Repository.findAll().size();
        abc10.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc10MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc10))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc10() throws Exception {
        int databaseSizeBeforeUpdate = abc10Repository.findAll().size();
        abc10.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc10MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc10))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc10WithPatch() throws Exception {
        // Initialize the database
        abc10Repository.saveAndFlush(abc10);

        int databaseSizeBeforeUpdate = abc10Repository.findAll().size();

        // Update the abc10 using partial update
        Abc10 partialUpdatedAbc10 = new Abc10();
        partialUpdatedAbc10.setId(abc10.getId());

        partialUpdatedAbc10.name(UPDATED_NAME);

        restAbc10MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc10.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc10))
            )
            .andExpect(status().isOk());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeUpdate);
        Abc10 testAbc10 = abc10List.get(abc10List.size() - 1);
        assertThat(testAbc10.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc10.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc10WithPatch() throws Exception {
        // Initialize the database
        abc10Repository.saveAndFlush(abc10);

        int databaseSizeBeforeUpdate = abc10Repository.findAll().size();

        // Update the abc10 using partial update
        Abc10 partialUpdatedAbc10 = new Abc10();
        partialUpdatedAbc10.setId(abc10.getId());

        partialUpdatedAbc10.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc10MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc10.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc10))
            )
            .andExpect(status().isOk());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeUpdate);
        Abc10 testAbc10 = abc10List.get(abc10List.size() - 1);
        assertThat(testAbc10.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc10.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc10() throws Exception {
        int databaseSizeBeforeUpdate = abc10Repository.findAll().size();
        abc10.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc10MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc10.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc10))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc10() throws Exception {
        int databaseSizeBeforeUpdate = abc10Repository.findAll().size();
        abc10.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc10MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc10))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc10() throws Exception {
        int databaseSizeBeforeUpdate = abc10Repository.findAll().size();
        abc10.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc10MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc10))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc10 in the database
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc10() throws Exception {
        // Initialize the database
        abc10Repository.saveAndFlush(abc10);

        int databaseSizeBeforeDelete = abc10Repository.findAll().size();

        // Delete the abc10
        restAbc10MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc10.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc10> abc10List = abc10Repository.findAll();
        assertThat(abc10List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
