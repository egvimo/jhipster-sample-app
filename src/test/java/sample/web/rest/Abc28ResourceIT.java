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
import sample.domain.Abc28;
import sample.repository.Abc28Repository;

/**
 * Integration tests for the {@link Abc28Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc28ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-28-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc28Repository abc28Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc28MockMvc;

    private Abc28 abc28;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc28 createEntity(EntityManager em) {
        Abc28 abc28 = new Abc28().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc28;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc28 createUpdatedEntity(EntityManager em) {
        Abc28 abc28 = new Abc28().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc28;
    }

    @BeforeEach
    public void initTest() {
        abc28 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc28() throws Exception {
        int databaseSizeBeforeCreate = abc28Repository.findAll().size();
        // Create the Abc28
        restAbc28MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc28))
            )
            .andExpect(status().isCreated());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeCreate + 1);
        Abc28 testAbc28 = abc28List.get(abc28List.size() - 1);
        assertThat(testAbc28.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc28.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc28WithExistingId() throws Exception {
        // Create the Abc28 with an existing ID
        abc28.setId(1L);

        int databaseSizeBeforeCreate = abc28Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc28MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc28))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc28Repository.findAll().size();
        // set the field null
        abc28.setName(null);

        // Create the Abc28, which fails.

        restAbc28MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc28))
            )
            .andExpect(status().isBadRequest());

        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc28s() throws Exception {
        // Initialize the database
        abc28Repository.saveAndFlush(abc28);

        // Get all the abc28List
        restAbc28MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc28.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc28() throws Exception {
        // Initialize the database
        abc28Repository.saveAndFlush(abc28);

        // Get the abc28
        restAbc28MockMvc
            .perform(get(ENTITY_API_URL_ID, abc28.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc28.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc28() throws Exception {
        // Get the abc28
        restAbc28MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc28() throws Exception {
        // Initialize the database
        abc28Repository.saveAndFlush(abc28);

        int databaseSizeBeforeUpdate = abc28Repository.findAll().size();

        // Update the abc28
        Abc28 updatedAbc28 = abc28Repository.findById(abc28.getId()).get();
        // Disconnect from session so that the updates on updatedAbc28 are not directly saved in db
        em.detach(updatedAbc28);
        updatedAbc28.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc28MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc28.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc28))
            )
            .andExpect(status().isOk());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeUpdate);
        Abc28 testAbc28 = abc28List.get(abc28List.size() - 1);
        assertThat(testAbc28.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc28.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc28() throws Exception {
        int databaseSizeBeforeUpdate = abc28Repository.findAll().size();
        abc28.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc28MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc28.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc28))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc28() throws Exception {
        int databaseSizeBeforeUpdate = abc28Repository.findAll().size();
        abc28.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc28MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc28))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc28() throws Exception {
        int databaseSizeBeforeUpdate = abc28Repository.findAll().size();
        abc28.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc28MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc28))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc28WithPatch() throws Exception {
        // Initialize the database
        abc28Repository.saveAndFlush(abc28);

        int databaseSizeBeforeUpdate = abc28Repository.findAll().size();

        // Update the abc28 using partial update
        Abc28 partialUpdatedAbc28 = new Abc28();
        partialUpdatedAbc28.setId(abc28.getId());

        partialUpdatedAbc28.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc28MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc28.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc28))
            )
            .andExpect(status().isOk());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeUpdate);
        Abc28 testAbc28 = abc28List.get(abc28List.size() - 1);
        assertThat(testAbc28.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc28.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc28WithPatch() throws Exception {
        // Initialize the database
        abc28Repository.saveAndFlush(abc28);

        int databaseSizeBeforeUpdate = abc28Repository.findAll().size();

        // Update the abc28 using partial update
        Abc28 partialUpdatedAbc28 = new Abc28();
        partialUpdatedAbc28.setId(abc28.getId());

        partialUpdatedAbc28.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc28MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc28.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc28))
            )
            .andExpect(status().isOk());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeUpdate);
        Abc28 testAbc28 = abc28List.get(abc28List.size() - 1);
        assertThat(testAbc28.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc28.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc28() throws Exception {
        int databaseSizeBeforeUpdate = abc28Repository.findAll().size();
        abc28.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc28MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc28.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc28))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc28() throws Exception {
        int databaseSizeBeforeUpdate = abc28Repository.findAll().size();
        abc28.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc28MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc28))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc28() throws Exception {
        int databaseSizeBeforeUpdate = abc28Repository.findAll().size();
        abc28.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc28MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc28))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc28 in the database
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc28() throws Exception {
        // Initialize the database
        abc28Repository.saveAndFlush(abc28);

        int databaseSizeBeforeDelete = abc28Repository.findAll().size();

        // Delete the abc28
        restAbc28MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc28.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc28> abc28List = abc28Repository.findAll();
        assertThat(abc28List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
