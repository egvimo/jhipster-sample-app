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
import sample.domain.Abc19;
import sample.repository.Abc19Repository;

/**
 * Integration tests for the {@link Abc19Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc19ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-19-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc19Repository abc19Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc19MockMvc;

    private Abc19 abc19;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc19 createEntity(EntityManager em) {
        Abc19 abc19 = new Abc19().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc19;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc19 createUpdatedEntity(EntityManager em) {
        Abc19 abc19 = new Abc19().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc19;
    }

    @BeforeEach
    public void initTest() {
        abc19 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc19() throws Exception {
        int databaseSizeBeforeCreate = abc19Repository.findAll().size();
        // Create the Abc19
        restAbc19MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc19))
            )
            .andExpect(status().isCreated());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeCreate + 1);
        Abc19 testAbc19 = abc19List.get(abc19List.size() - 1);
        assertThat(testAbc19.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc19.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc19WithExistingId() throws Exception {
        // Create the Abc19 with an existing ID
        abc19.setId(1L);

        int databaseSizeBeforeCreate = abc19Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc19MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc19))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc19Repository.findAll().size();
        // set the field null
        abc19.setName(null);

        // Create the Abc19, which fails.

        restAbc19MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc19))
            )
            .andExpect(status().isBadRequest());

        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc19s() throws Exception {
        // Initialize the database
        abc19Repository.saveAndFlush(abc19);

        // Get all the abc19List
        restAbc19MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc19.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc19() throws Exception {
        // Initialize the database
        abc19Repository.saveAndFlush(abc19);

        // Get the abc19
        restAbc19MockMvc
            .perform(get(ENTITY_API_URL_ID, abc19.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc19.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc19() throws Exception {
        // Get the abc19
        restAbc19MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc19() throws Exception {
        // Initialize the database
        abc19Repository.saveAndFlush(abc19);

        int databaseSizeBeforeUpdate = abc19Repository.findAll().size();

        // Update the abc19
        Abc19 updatedAbc19 = abc19Repository.findById(abc19.getId()).get();
        // Disconnect from session so that the updates on updatedAbc19 are not directly saved in db
        em.detach(updatedAbc19);
        updatedAbc19.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc19MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc19.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc19))
            )
            .andExpect(status().isOk());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeUpdate);
        Abc19 testAbc19 = abc19List.get(abc19List.size() - 1);
        assertThat(testAbc19.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc19.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc19() throws Exception {
        int databaseSizeBeforeUpdate = abc19Repository.findAll().size();
        abc19.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc19MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc19.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc19))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc19() throws Exception {
        int databaseSizeBeforeUpdate = abc19Repository.findAll().size();
        abc19.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc19MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc19))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc19() throws Exception {
        int databaseSizeBeforeUpdate = abc19Repository.findAll().size();
        abc19.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc19MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc19))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc19WithPatch() throws Exception {
        // Initialize the database
        abc19Repository.saveAndFlush(abc19);

        int databaseSizeBeforeUpdate = abc19Repository.findAll().size();

        // Update the abc19 using partial update
        Abc19 partialUpdatedAbc19 = new Abc19();
        partialUpdatedAbc19.setId(abc19.getId());

        restAbc19MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc19.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc19))
            )
            .andExpect(status().isOk());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeUpdate);
        Abc19 testAbc19 = abc19List.get(abc19List.size() - 1);
        assertThat(testAbc19.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc19.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc19WithPatch() throws Exception {
        // Initialize the database
        abc19Repository.saveAndFlush(abc19);

        int databaseSizeBeforeUpdate = abc19Repository.findAll().size();

        // Update the abc19 using partial update
        Abc19 partialUpdatedAbc19 = new Abc19();
        partialUpdatedAbc19.setId(abc19.getId());

        partialUpdatedAbc19.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc19MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc19.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc19))
            )
            .andExpect(status().isOk());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeUpdate);
        Abc19 testAbc19 = abc19List.get(abc19List.size() - 1);
        assertThat(testAbc19.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc19.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc19() throws Exception {
        int databaseSizeBeforeUpdate = abc19Repository.findAll().size();
        abc19.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc19MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc19.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc19))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc19() throws Exception {
        int databaseSizeBeforeUpdate = abc19Repository.findAll().size();
        abc19.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc19MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc19))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc19() throws Exception {
        int databaseSizeBeforeUpdate = abc19Repository.findAll().size();
        abc19.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc19MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc19))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc19 in the database
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc19() throws Exception {
        // Initialize the database
        abc19Repository.saveAndFlush(abc19);

        int databaseSizeBeforeDelete = abc19Repository.findAll().size();

        // Delete the abc19
        restAbc19MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc19.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc19> abc19List = abc19Repository.findAll();
        assertThat(abc19List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
