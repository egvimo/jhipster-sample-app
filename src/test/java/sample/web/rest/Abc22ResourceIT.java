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
import sample.domain.Abc22;
import sample.repository.Abc22Repository;

/**
 * Integration tests for the {@link Abc22Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc22ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-22-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc22Repository abc22Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc22MockMvc;

    private Abc22 abc22;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc22 createEntity(EntityManager em) {
        Abc22 abc22 = new Abc22().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc22;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc22 createUpdatedEntity(EntityManager em) {
        Abc22 abc22 = new Abc22().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc22;
    }

    @BeforeEach
    public void initTest() {
        abc22 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc22() throws Exception {
        int databaseSizeBeforeCreate = abc22Repository.findAll().size();
        // Create the Abc22
        restAbc22MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc22))
            )
            .andExpect(status().isCreated());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeCreate + 1);
        Abc22 testAbc22 = abc22List.get(abc22List.size() - 1);
        assertThat(testAbc22.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc22.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc22WithExistingId() throws Exception {
        // Create the Abc22 with an existing ID
        abc22.setId(1L);

        int databaseSizeBeforeCreate = abc22Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc22MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc22))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc22Repository.findAll().size();
        // set the field null
        abc22.setName(null);

        // Create the Abc22, which fails.

        restAbc22MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc22))
            )
            .andExpect(status().isBadRequest());

        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc22s() throws Exception {
        // Initialize the database
        abc22Repository.saveAndFlush(abc22);

        // Get all the abc22List
        restAbc22MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc22.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc22() throws Exception {
        // Initialize the database
        abc22Repository.saveAndFlush(abc22);

        // Get the abc22
        restAbc22MockMvc
            .perform(get(ENTITY_API_URL_ID, abc22.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc22.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc22() throws Exception {
        // Get the abc22
        restAbc22MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc22() throws Exception {
        // Initialize the database
        abc22Repository.saveAndFlush(abc22);

        int databaseSizeBeforeUpdate = abc22Repository.findAll().size();

        // Update the abc22
        Abc22 updatedAbc22 = abc22Repository.findById(abc22.getId()).get();
        // Disconnect from session so that the updates on updatedAbc22 are not directly saved in db
        em.detach(updatedAbc22);
        updatedAbc22.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc22MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc22.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc22))
            )
            .andExpect(status().isOk());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeUpdate);
        Abc22 testAbc22 = abc22List.get(abc22List.size() - 1);
        assertThat(testAbc22.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc22.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc22() throws Exception {
        int databaseSizeBeforeUpdate = abc22Repository.findAll().size();
        abc22.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc22MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc22.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc22))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc22() throws Exception {
        int databaseSizeBeforeUpdate = abc22Repository.findAll().size();
        abc22.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc22MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc22))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc22() throws Exception {
        int databaseSizeBeforeUpdate = abc22Repository.findAll().size();
        abc22.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc22MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc22))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc22WithPatch() throws Exception {
        // Initialize the database
        abc22Repository.saveAndFlush(abc22);

        int databaseSizeBeforeUpdate = abc22Repository.findAll().size();

        // Update the abc22 using partial update
        Abc22 partialUpdatedAbc22 = new Abc22();
        partialUpdatedAbc22.setId(abc22.getId());

        partialUpdatedAbc22.otherField(UPDATED_OTHER_FIELD);

        restAbc22MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc22.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc22))
            )
            .andExpect(status().isOk());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeUpdate);
        Abc22 testAbc22 = abc22List.get(abc22List.size() - 1);
        assertThat(testAbc22.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc22.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc22WithPatch() throws Exception {
        // Initialize the database
        abc22Repository.saveAndFlush(abc22);

        int databaseSizeBeforeUpdate = abc22Repository.findAll().size();

        // Update the abc22 using partial update
        Abc22 partialUpdatedAbc22 = new Abc22();
        partialUpdatedAbc22.setId(abc22.getId());

        partialUpdatedAbc22.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc22MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc22.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc22))
            )
            .andExpect(status().isOk());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeUpdate);
        Abc22 testAbc22 = abc22List.get(abc22List.size() - 1);
        assertThat(testAbc22.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc22.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc22() throws Exception {
        int databaseSizeBeforeUpdate = abc22Repository.findAll().size();
        abc22.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc22MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc22.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc22))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc22() throws Exception {
        int databaseSizeBeforeUpdate = abc22Repository.findAll().size();
        abc22.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc22MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc22))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc22() throws Exception {
        int databaseSizeBeforeUpdate = abc22Repository.findAll().size();
        abc22.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc22MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc22))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc22 in the database
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc22() throws Exception {
        // Initialize the database
        abc22Repository.saveAndFlush(abc22);

        int databaseSizeBeforeDelete = abc22Repository.findAll().size();

        // Delete the abc22
        restAbc22MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc22.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc22> abc22List = abc22Repository.findAll();
        assertThat(abc22List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
