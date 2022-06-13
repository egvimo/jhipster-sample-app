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
import sample.domain.Abc21;
import sample.repository.Abc21Repository;

/**
 * Integration tests for the {@link Abc21Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc21ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-21-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc21Repository abc21Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc21MockMvc;

    private Abc21 abc21;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc21 createEntity(EntityManager em) {
        Abc21 abc21 = new Abc21().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc21;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc21 createUpdatedEntity(EntityManager em) {
        Abc21 abc21 = new Abc21().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc21;
    }

    @BeforeEach
    public void initTest() {
        abc21 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc21() throws Exception {
        int databaseSizeBeforeCreate = abc21Repository.findAll().size();
        // Create the Abc21
        restAbc21MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc21))
            )
            .andExpect(status().isCreated());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeCreate + 1);
        Abc21 testAbc21 = abc21List.get(abc21List.size() - 1);
        assertThat(testAbc21.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc21.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc21WithExistingId() throws Exception {
        // Create the Abc21 with an existing ID
        abc21.setId(1L);

        int databaseSizeBeforeCreate = abc21Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc21MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc21))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc21Repository.findAll().size();
        // set the field null
        abc21.setName(null);

        // Create the Abc21, which fails.

        restAbc21MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc21))
            )
            .andExpect(status().isBadRequest());

        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc21s() throws Exception {
        // Initialize the database
        abc21Repository.saveAndFlush(abc21);

        // Get all the abc21List
        restAbc21MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc21.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc21() throws Exception {
        // Initialize the database
        abc21Repository.saveAndFlush(abc21);

        // Get the abc21
        restAbc21MockMvc
            .perform(get(ENTITY_API_URL_ID, abc21.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc21.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc21() throws Exception {
        // Get the abc21
        restAbc21MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc21() throws Exception {
        // Initialize the database
        abc21Repository.saveAndFlush(abc21);

        int databaseSizeBeforeUpdate = abc21Repository.findAll().size();

        // Update the abc21
        Abc21 updatedAbc21 = abc21Repository.findById(abc21.getId()).get();
        // Disconnect from session so that the updates on updatedAbc21 are not directly saved in db
        em.detach(updatedAbc21);
        updatedAbc21.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc21MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc21.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc21))
            )
            .andExpect(status().isOk());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeUpdate);
        Abc21 testAbc21 = abc21List.get(abc21List.size() - 1);
        assertThat(testAbc21.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc21.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc21() throws Exception {
        int databaseSizeBeforeUpdate = abc21Repository.findAll().size();
        abc21.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc21MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc21.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc21))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc21() throws Exception {
        int databaseSizeBeforeUpdate = abc21Repository.findAll().size();
        abc21.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc21MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc21))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc21() throws Exception {
        int databaseSizeBeforeUpdate = abc21Repository.findAll().size();
        abc21.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc21MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc21))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc21WithPatch() throws Exception {
        // Initialize the database
        abc21Repository.saveAndFlush(abc21);

        int databaseSizeBeforeUpdate = abc21Repository.findAll().size();

        // Update the abc21 using partial update
        Abc21 partialUpdatedAbc21 = new Abc21();
        partialUpdatedAbc21.setId(abc21.getId());

        partialUpdatedAbc21.name(UPDATED_NAME);

        restAbc21MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc21.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc21))
            )
            .andExpect(status().isOk());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeUpdate);
        Abc21 testAbc21 = abc21List.get(abc21List.size() - 1);
        assertThat(testAbc21.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc21.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc21WithPatch() throws Exception {
        // Initialize the database
        abc21Repository.saveAndFlush(abc21);

        int databaseSizeBeforeUpdate = abc21Repository.findAll().size();

        // Update the abc21 using partial update
        Abc21 partialUpdatedAbc21 = new Abc21();
        partialUpdatedAbc21.setId(abc21.getId());

        partialUpdatedAbc21.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc21MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc21.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc21))
            )
            .andExpect(status().isOk());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeUpdate);
        Abc21 testAbc21 = abc21List.get(abc21List.size() - 1);
        assertThat(testAbc21.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc21.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc21() throws Exception {
        int databaseSizeBeforeUpdate = abc21Repository.findAll().size();
        abc21.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc21MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc21.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc21))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc21() throws Exception {
        int databaseSizeBeforeUpdate = abc21Repository.findAll().size();
        abc21.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc21MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc21))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc21() throws Exception {
        int databaseSizeBeforeUpdate = abc21Repository.findAll().size();
        abc21.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc21MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc21))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc21 in the database
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc21() throws Exception {
        // Initialize the database
        abc21Repository.saveAndFlush(abc21);

        int databaseSizeBeforeDelete = abc21Repository.findAll().size();

        // Delete the abc21
        restAbc21MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc21.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc21> abc21List = abc21Repository.findAll();
        assertThat(abc21List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
