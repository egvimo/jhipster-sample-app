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
import sample.domain.Abc9;
import sample.repository.Abc9Repository;

/**
 * Integration tests for the {@link Abc9Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc9ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-9-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc9Repository abc9Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc9MockMvc;

    private Abc9 abc9;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc9 createEntity(EntityManager em) {
        Abc9 abc9 = new Abc9().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc9;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc9 createUpdatedEntity(EntityManager em) {
        Abc9 abc9 = new Abc9().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc9;
    }

    @BeforeEach
    public void initTest() {
        abc9 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc9() throws Exception {
        int databaseSizeBeforeCreate = abc9Repository.findAll().size();
        // Create the Abc9
        restAbc9MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc9))
            )
            .andExpect(status().isCreated());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeCreate + 1);
        Abc9 testAbc9 = abc9List.get(abc9List.size() - 1);
        assertThat(testAbc9.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc9.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc9WithExistingId() throws Exception {
        // Create the Abc9 with an existing ID
        abc9.setId(1L);

        int databaseSizeBeforeCreate = abc9Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc9MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc9))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc9Repository.findAll().size();
        // set the field null
        abc9.setName(null);

        // Create the Abc9, which fails.

        restAbc9MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc9))
            )
            .andExpect(status().isBadRequest());

        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc9s() throws Exception {
        // Initialize the database
        abc9Repository.saveAndFlush(abc9);

        // Get all the abc9List
        restAbc9MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc9.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc9() throws Exception {
        // Initialize the database
        abc9Repository.saveAndFlush(abc9);

        // Get the abc9
        restAbc9MockMvc
            .perform(get(ENTITY_API_URL_ID, abc9.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc9.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc9() throws Exception {
        // Get the abc9
        restAbc9MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc9() throws Exception {
        // Initialize the database
        abc9Repository.saveAndFlush(abc9);

        int databaseSizeBeforeUpdate = abc9Repository.findAll().size();

        // Update the abc9
        Abc9 updatedAbc9 = abc9Repository.findById(abc9.getId()).get();
        // Disconnect from session so that the updates on updatedAbc9 are not directly saved in db
        em.detach(updatedAbc9);
        updatedAbc9.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc9MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc9.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc9))
            )
            .andExpect(status().isOk());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeUpdate);
        Abc9 testAbc9 = abc9List.get(abc9List.size() - 1);
        assertThat(testAbc9.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc9.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc9() throws Exception {
        int databaseSizeBeforeUpdate = abc9Repository.findAll().size();
        abc9.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc9MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc9.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc9))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc9() throws Exception {
        int databaseSizeBeforeUpdate = abc9Repository.findAll().size();
        abc9.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc9MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc9))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc9() throws Exception {
        int databaseSizeBeforeUpdate = abc9Repository.findAll().size();
        abc9.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc9MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc9))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc9WithPatch() throws Exception {
        // Initialize the database
        abc9Repository.saveAndFlush(abc9);

        int databaseSizeBeforeUpdate = abc9Repository.findAll().size();

        // Update the abc9 using partial update
        Abc9 partialUpdatedAbc9 = new Abc9();
        partialUpdatedAbc9.setId(abc9.getId());

        restAbc9MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc9.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc9))
            )
            .andExpect(status().isOk());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeUpdate);
        Abc9 testAbc9 = abc9List.get(abc9List.size() - 1);
        assertThat(testAbc9.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc9.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc9WithPatch() throws Exception {
        // Initialize the database
        abc9Repository.saveAndFlush(abc9);

        int databaseSizeBeforeUpdate = abc9Repository.findAll().size();

        // Update the abc9 using partial update
        Abc9 partialUpdatedAbc9 = new Abc9();
        partialUpdatedAbc9.setId(abc9.getId());

        partialUpdatedAbc9.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc9MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc9.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc9))
            )
            .andExpect(status().isOk());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeUpdate);
        Abc9 testAbc9 = abc9List.get(abc9List.size() - 1);
        assertThat(testAbc9.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc9.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc9() throws Exception {
        int databaseSizeBeforeUpdate = abc9Repository.findAll().size();
        abc9.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc9MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc9.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc9))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc9() throws Exception {
        int databaseSizeBeforeUpdate = abc9Repository.findAll().size();
        abc9.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc9MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc9))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc9() throws Exception {
        int databaseSizeBeforeUpdate = abc9Repository.findAll().size();
        abc9.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc9MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc9))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc9 in the database
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc9() throws Exception {
        // Initialize the database
        abc9Repository.saveAndFlush(abc9);

        int databaseSizeBeforeDelete = abc9Repository.findAll().size();

        // Delete the abc9
        restAbc9MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc9.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc9> abc9List = abc9Repository.findAll();
        assertThat(abc9List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
