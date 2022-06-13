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
import sample.domain.Abc7;
import sample.repository.Abc7Repository;

/**
 * Integration tests for the {@link Abc7Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc7ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-7-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc7Repository abc7Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc7MockMvc;

    private Abc7 abc7;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc7 createEntity(EntityManager em) {
        Abc7 abc7 = new Abc7().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc7;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc7 createUpdatedEntity(EntityManager em) {
        Abc7 abc7 = new Abc7().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc7;
    }

    @BeforeEach
    public void initTest() {
        abc7 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc7() throws Exception {
        int databaseSizeBeforeCreate = abc7Repository.findAll().size();
        // Create the Abc7
        restAbc7MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc7))
            )
            .andExpect(status().isCreated());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeCreate + 1);
        Abc7 testAbc7 = abc7List.get(abc7List.size() - 1);
        assertThat(testAbc7.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc7.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc7WithExistingId() throws Exception {
        // Create the Abc7 with an existing ID
        abc7.setId(1L);

        int databaseSizeBeforeCreate = abc7Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc7MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc7))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc7Repository.findAll().size();
        // set the field null
        abc7.setName(null);

        // Create the Abc7, which fails.

        restAbc7MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc7))
            )
            .andExpect(status().isBadRequest());

        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc7s() throws Exception {
        // Initialize the database
        abc7Repository.saveAndFlush(abc7);

        // Get all the abc7List
        restAbc7MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc7.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc7() throws Exception {
        // Initialize the database
        abc7Repository.saveAndFlush(abc7);

        // Get the abc7
        restAbc7MockMvc
            .perform(get(ENTITY_API_URL_ID, abc7.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc7.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc7() throws Exception {
        // Get the abc7
        restAbc7MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc7() throws Exception {
        // Initialize the database
        abc7Repository.saveAndFlush(abc7);

        int databaseSizeBeforeUpdate = abc7Repository.findAll().size();

        // Update the abc7
        Abc7 updatedAbc7 = abc7Repository.findById(abc7.getId()).get();
        // Disconnect from session so that the updates on updatedAbc7 are not directly saved in db
        em.detach(updatedAbc7);
        updatedAbc7.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc7MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc7.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc7))
            )
            .andExpect(status().isOk());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeUpdate);
        Abc7 testAbc7 = abc7List.get(abc7List.size() - 1);
        assertThat(testAbc7.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc7.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc7() throws Exception {
        int databaseSizeBeforeUpdate = abc7Repository.findAll().size();
        abc7.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc7MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc7.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc7))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc7() throws Exception {
        int databaseSizeBeforeUpdate = abc7Repository.findAll().size();
        abc7.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc7MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc7))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc7() throws Exception {
        int databaseSizeBeforeUpdate = abc7Repository.findAll().size();
        abc7.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc7MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc7))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc7WithPatch() throws Exception {
        // Initialize the database
        abc7Repository.saveAndFlush(abc7);

        int databaseSizeBeforeUpdate = abc7Repository.findAll().size();

        // Update the abc7 using partial update
        Abc7 partialUpdatedAbc7 = new Abc7();
        partialUpdatedAbc7.setId(abc7.getId());

        partialUpdatedAbc7.otherField(UPDATED_OTHER_FIELD);

        restAbc7MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc7.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc7))
            )
            .andExpect(status().isOk());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeUpdate);
        Abc7 testAbc7 = abc7List.get(abc7List.size() - 1);
        assertThat(testAbc7.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc7.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc7WithPatch() throws Exception {
        // Initialize the database
        abc7Repository.saveAndFlush(abc7);

        int databaseSizeBeforeUpdate = abc7Repository.findAll().size();

        // Update the abc7 using partial update
        Abc7 partialUpdatedAbc7 = new Abc7();
        partialUpdatedAbc7.setId(abc7.getId());

        partialUpdatedAbc7.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc7MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc7.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc7))
            )
            .andExpect(status().isOk());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeUpdate);
        Abc7 testAbc7 = abc7List.get(abc7List.size() - 1);
        assertThat(testAbc7.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc7.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc7() throws Exception {
        int databaseSizeBeforeUpdate = abc7Repository.findAll().size();
        abc7.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc7MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc7.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc7))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc7() throws Exception {
        int databaseSizeBeforeUpdate = abc7Repository.findAll().size();
        abc7.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc7MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc7))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc7() throws Exception {
        int databaseSizeBeforeUpdate = abc7Repository.findAll().size();
        abc7.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc7MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc7))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc7 in the database
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc7() throws Exception {
        // Initialize the database
        abc7Repository.saveAndFlush(abc7);

        int databaseSizeBeforeDelete = abc7Repository.findAll().size();

        // Delete the abc7
        restAbc7MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc7.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc7> abc7List = abc7Repository.findAll();
        assertThat(abc7List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
