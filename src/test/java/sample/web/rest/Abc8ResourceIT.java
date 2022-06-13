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
import sample.domain.Abc8;
import sample.repository.Abc8Repository;

/**
 * Integration tests for the {@link Abc8Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc8ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-8-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc8Repository abc8Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc8MockMvc;

    private Abc8 abc8;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc8 createEntity(EntityManager em) {
        Abc8 abc8 = new Abc8().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc8;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc8 createUpdatedEntity(EntityManager em) {
        Abc8 abc8 = new Abc8().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc8;
    }

    @BeforeEach
    public void initTest() {
        abc8 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc8() throws Exception {
        int databaseSizeBeforeCreate = abc8Repository.findAll().size();
        // Create the Abc8
        restAbc8MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc8))
            )
            .andExpect(status().isCreated());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeCreate + 1);
        Abc8 testAbc8 = abc8List.get(abc8List.size() - 1);
        assertThat(testAbc8.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc8.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc8WithExistingId() throws Exception {
        // Create the Abc8 with an existing ID
        abc8.setId(1L);

        int databaseSizeBeforeCreate = abc8Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc8MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc8))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc8Repository.findAll().size();
        // set the field null
        abc8.setName(null);

        // Create the Abc8, which fails.

        restAbc8MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc8))
            )
            .andExpect(status().isBadRequest());

        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc8s() throws Exception {
        // Initialize the database
        abc8Repository.saveAndFlush(abc8);

        // Get all the abc8List
        restAbc8MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc8.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc8() throws Exception {
        // Initialize the database
        abc8Repository.saveAndFlush(abc8);

        // Get the abc8
        restAbc8MockMvc
            .perform(get(ENTITY_API_URL_ID, abc8.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc8.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc8() throws Exception {
        // Get the abc8
        restAbc8MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc8() throws Exception {
        // Initialize the database
        abc8Repository.saveAndFlush(abc8);

        int databaseSizeBeforeUpdate = abc8Repository.findAll().size();

        // Update the abc8
        Abc8 updatedAbc8 = abc8Repository.findById(abc8.getId()).get();
        // Disconnect from session so that the updates on updatedAbc8 are not directly saved in db
        em.detach(updatedAbc8);
        updatedAbc8.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc8MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc8.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc8))
            )
            .andExpect(status().isOk());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeUpdate);
        Abc8 testAbc8 = abc8List.get(abc8List.size() - 1);
        assertThat(testAbc8.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc8.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc8() throws Exception {
        int databaseSizeBeforeUpdate = abc8Repository.findAll().size();
        abc8.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc8MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc8.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc8))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc8() throws Exception {
        int databaseSizeBeforeUpdate = abc8Repository.findAll().size();
        abc8.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc8MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc8))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc8() throws Exception {
        int databaseSizeBeforeUpdate = abc8Repository.findAll().size();
        abc8.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc8MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc8))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc8WithPatch() throws Exception {
        // Initialize the database
        abc8Repository.saveAndFlush(abc8);

        int databaseSizeBeforeUpdate = abc8Repository.findAll().size();

        // Update the abc8 using partial update
        Abc8 partialUpdatedAbc8 = new Abc8();
        partialUpdatedAbc8.setId(abc8.getId());

        partialUpdatedAbc8.otherField(UPDATED_OTHER_FIELD);

        restAbc8MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc8.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc8))
            )
            .andExpect(status().isOk());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeUpdate);
        Abc8 testAbc8 = abc8List.get(abc8List.size() - 1);
        assertThat(testAbc8.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc8.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc8WithPatch() throws Exception {
        // Initialize the database
        abc8Repository.saveAndFlush(abc8);

        int databaseSizeBeforeUpdate = abc8Repository.findAll().size();

        // Update the abc8 using partial update
        Abc8 partialUpdatedAbc8 = new Abc8();
        partialUpdatedAbc8.setId(abc8.getId());

        partialUpdatedAbc8.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc8MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc8.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc8))
            )
            .andExpect(status().isOk());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeUpdate);
        Abc8 testAbc8 = abc8List.get(abc8List.size() - 1);
        assertThat(testAbc8.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc8.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc8() throws Exception {
        int databaseSizeBeforeUpdate = abc8Repository.findAll().size();
        abc8.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc8MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc8.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc8))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc8() throws Exception {
        int databaseSizeBeforeUpdate = abc8Repository.findAll().size();
        abc8.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc8MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc8))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc8() throws Exception {
        int databaseSizeBeforeUpdate = abc8Repository.findAll().size();
        abc8.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc8MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc8))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc8 in the database
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc8() throws Exception {
        // Initialize the database
        abc8Repository.saveAndFlush(abc8);

        int databaseSizeBeforeDelete = abc8Repository.findAll().size();

        // Delete the abc8
        restAbc8MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc8.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc8> abc8List = abc8Repository.findAll();
        assertThat(abc8List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
