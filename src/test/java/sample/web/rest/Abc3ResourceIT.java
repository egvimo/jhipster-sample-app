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
import sample.domain.Abc3;
import sample.repository.Abc3Repository;

/**
 * Integration tests for the {@link Abc3Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc3ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-3-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc3Repository abc3Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc3MockMvc;

    private Abc3 abc3;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc3 createEntity(EntityManager em) {
        Abc3 abc3 = new Abc3().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc3;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc3 createUpdatedEntity(EntityManager em) {
        Abc3 abc3 = new Abc3().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc3;
    }

    @BeforeEach
    public void initTest() {
        abc3 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc3() throws Exception {
        int databaseSizeBeforeCreate = abc3Repository.findAll().size();
        // Create the Abc3
        restAbc3MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc3))
            )
            .andExpect(status().isCreated());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeCreate + 1);
        Abc3 testAbc3 = abc3List.get(abc3List.size() - 1);
        assertThat(testAbc3.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc3.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc3WithExistingId() throws Exception {
        // Create the Abc3 with an existing ID
        abc3.setId(1L);

        int databaseSizeBeforeCreate = abc3Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc3MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc3))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc3Repository.findAll().size();
        // set the field null
        abc3.setName(null);

        // Create the Abc3, which fails.

        restAbc3MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc3))
            )
            .andExpect(status().isBadRequest());

        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc3s() throws Exception {
        // Initialize the database
        abc3Repository.saveAndFlush(abc3);

        // Get all the abc3List
        restAbc3MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc3.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc3() throws Exception {
        // Initialize the database
        abc3Repository.saveAndFlush(abc3);

        // Get the abc3
        restAbc3MockMvc
            .perform(get(ENTITY_API_URL_ID, abc3.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc3.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc3() throws Exception {
        // Get the abc3
        restAbc3MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc3() throws Exception {
        // Initialize the database
        abc3Repository.saveAndFlush(abc3);

        int databaseSizeBeforeUpdate = abc3Repository.findAll().size();

        // Update the abc3
        Abc3 updatedAbc3 = abc3Repository.findById(abc3.getId()).get();
        // Disconnect from session so that the updates on updatedAbc3 are not directly saved in db
        em.detach(updatedAbc3);
        updatedAbc3.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc3MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc3.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc3))
            )
            .andExpect(status().isOk());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeUpdate);
        Abc3 testAbc3 = abc3List.get(abc3List.size() - 1);
        assertThat(testAbc3.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc3.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc3() throws Exception {
        int databaseSizeBeforeUpdate = abc3Repository.findAll().size();
        abc3.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc3MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc3.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc3))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc3() throws Exception {
        int databaseSizeBeforeUpdate = abc3Repository.findAll().size();
        abc3.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc3MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc3))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc3() throws Exception {
        int databaseSizeBeforeUpdate = abc3Repository.findAll().size();
        abc3.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc3MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc3))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc3WithPatch() throws Exception {
        // Initialize the database
        abc3Repository.saveAndFlush(abc3);

        int databaseSizeBeforeUpdate = abc3Repository.findAll().size();

        // Update the abc3 using partial update
        Abc3 partialUpdatedAbc3 = new Abc3();
        partialUpdatedAbc3.setId(abc3.getId());

        partialUpdatedAbc3.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc3MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc3.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc3))
            )
            .andExpect(status().isOk());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeUpdate);
        Abc3 testAbc3 = abc3List.get(abc3List.size() - 1);
        assertThat(testAbc3.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc3.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc3WithPatch() throws Exception {
        // Initialize the database
        abc3Repository.saveAndFlush(abc3);

        int databaseSizeBeforeUpdate = abc3Repository.findAll().size();

        // Update the abc3 using partial update
        Abc3 partialUpdatedAbc3 = new Abc3();
        partialUpdatedAbc3.setId(abc3.getId());

        partialUpdatedAbc3.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc3MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc3.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc3))
            )
            .andExpect(status().isOk());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeUpdate);
        Abc3 testAbc3 = abc3List.get(abc3List.size() - 1);
        assertThat(testAbc3.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc3.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc3() throws Exception {
        int databaseSizeBeforeUpdate = abc3Repository.findAll().size();
        abc3.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc3MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc3.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc3))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc3() throws Exception {
        int databaseSizeBeforeUpdate = abc3Repository.findAll().size();
        abc3.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc3MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc3))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc3() throws Exception {
        int databaseSizeBeforeUpdate = abc3Repository.findAll().size();
        abc3.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc3MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc3))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc3 in the database
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc3() throws Exception {
        // Initialize the database
        abc3Repository.saveAndFlush(abc3);

        int databaseSizeBeforeDelete = abc3Repository.findAll().size();

        // Delete the abc3
        restAbc3MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc3.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc3> abc3List = abc3Repository.findAll();
        assertThat(abc3List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
