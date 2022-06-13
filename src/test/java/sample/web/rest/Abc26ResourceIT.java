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
import sample.domain.Abc26;
import sample.repository.Abc26Repository;

/**
 * Integration tests for the {@link Abc26Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc26ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-26-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc26Repository abc26Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc26MockMvc;

    private Abc26 abc26;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc26 createEntity(EntityManager em) {
        Abc26 abc26 = new Abc26().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc26;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc26 createUpdatedEntity(EntityManager em) {
        Abc26 abc26 = new Abc26().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc26;
    }

    @BeforeEach
    public void initTest() {
        abc26 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc26() throws Exception {
        int databaseSizeBeforeCreate = abc26Repository.findAll().size();
        // Create the Abc26
        restAbc26MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc26))
            )
            .andExpect(status().isCreated());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeCreate + 1);
        Abc26 testAbc26 = abc26List.get(abc26List.size() - 1);
        assertThat(testAbc26.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc26.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc26WithExistingId() throws Exception {
        // Create the Abc26 with an existing ID
        abc26.setId(1L);

        int databaseSizeBeforeCreate = abc26Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc26MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc26))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc26Repository.findAll().size();
        // set the field null
        abc26.setName(null);

        // Create the Abc26, which fails.

        restAbc26MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc26))
            )
            .andExpect(status().isBadRequest());

        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc26s() throws Exception {
        // Initialize the database
        abc26Repository.saveAndFlush(abc26);

        // Get all the abc26List
        restAbc26MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc26.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc26() throws Exception {
        // Initialize the database
        abc26Repository.saveAndFlush(abc26);

        // Get the abc26
        restAbc26MockMvc
            .perform(get(ENTITY_API_URL_ID, abc26.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc26.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc26() throws Exception {
        // Get the abc26
        restAbc26MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc26() throws Exception {
        // Initialize the database
        abc26Repository.saveAndFlush(abc26);

        int databaseSizeBeforeUpdate = abc26Repository.findAll().size();

        // Update the abc26
        Abc26 updatedAbc26 = abc26Repository.findById(abc26.getId()).get();
        // Disconnect from session so that the updates on updatedAbc26 are not directly saved in db
        em.detach(updatedAbc26);
        updatedAbc26.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc26MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc26.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc26))
            )
            .andExpect(status().isOk());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeUpdate);
        Abc26 testAbc26 = abc26List.get(abc26List.size() - 1);
        assertThat(testAbc26.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc26.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc26() throws Exception {
        int databaseSizeBeforeUpdate = abc26Repository.findAll().size();
        abc26.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc26MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc26.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc26))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc26() throws Exception {
        int databaseSizeBeforeUpdate = abc26Repository.findAll().size();
        abc26.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc26MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc26))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc26() throws Exception {
        int databaseSizeBeforeUpdate = abc26Repository.findAll().size();
        abc26.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc26MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc26))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc26WithPatch() throws Exception {
        // Initialize the database
        abc26Repository.saveAndFlush(abc26);

        int databaseSizeBeforeUpdate = abc26Repository.findAll().size();

        // Update the abc26 using partial update
        Abc26 partialUpdatedAbc26 = new Abc26();
        partialUpdatedAbc26.setId(abc26.getId());

        restAbc26MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc26.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc26))
            )
            .andExpect(status().isOk());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeUpdate);
        Abc26 testAbc26 = abc26List.get(abc26List.size() - 1);
        assertThat(testAbc26.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc26.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc26WithPatch() throws Exception {
        // Initialize the database
        abc26Repository.saveAndFlush(abc26);

        int databaseSizeBeforeUpdate = abc26Repository.findAll().size();

        // Update the abc26 using partial update
        Abc26 partialUpdatedAbc26 = new Abc26();
        partialUpdatedAbc26.setId(abc26.getId());

        partialUpdatedAbc26.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc26MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc26.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc26))
            )
            .andExpect(status().isOk());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeUpdate);
        Abc26 testAbc26 = abc26List.get(abc26List.size() - 1);
        assertThat(testAbc26.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc26.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc26() throws Exception {
        int databaseSizeBeforeUpdate = abc26Repository.findAll().size();
        abc26.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc26MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc26.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc26))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc26() throws Exception {
        int databaseSizeBeforeUpdate = abc26Repository.findAll().size();
        abc26.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc26MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc26))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc26() throws Exception {
        int databaseSizeBeforeUpdate = abc26Repository.findAll().size();
        abc26.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc26MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc26))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc26 in the database
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc26() throws Exception {
        // Initialize the database
        abc26Repository.saveAndFlush(abc26);

        int databaseSizeBeforeDelete = abc26Repository.findAll().size();

        // Delete the abc26
        restAbc26MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc26.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc26> abc26List = abc26Repository.findAll();
        assertThat(abc26List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
