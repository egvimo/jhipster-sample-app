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
import sample.domain.Abc6;
import sample.repository.Abc6Repository;

/**
 * Integration tests for the {@link Abc6Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc6ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-6-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc6Repository abc6Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc6MockMvc;

    private Abc6 abc6;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc6 createEntity(EntityManager em) {
        Abc6 abc6 = new Abc6().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc6;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc6 createUpdatedEntity(EntityManager em) {
        Abc6 abc6 = new Abc6().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc6;
    }

    @BeforeEach
    public void initTest() {
        abc6 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc6() throws Exception {
        int databaseSizeBeforeCreate = abc6Repository.findAll().size();
        // Create the Abc6
        restAbc6MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc6))
            )
            .andExpect(status().isCreated());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeCreate + 1);
        Abc6 testAbc6 = abc6List.get(abc6List.size() - 1);
        assertThat(testAbc6.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc6.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc6WithExistingId() throws Exception {
        // Create the Abc6 with an existing ID
        abc6.setId(1L);

        int databaseSizeBeforeCreate = abc6Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc6MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc6))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc6Repository.findAll().size();
        // set the field null
        abc6.setName(null);

        // Create the Abc6, which fails.

        restAbc6MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc6))
            )
            .andExpect(status().isBadRequest());

        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc6s() throws Exception {
        // Initialize the database
        abc6Repository.saveAndFlush(abc6);

        // Get all the abc6List
        restAbc6MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc6.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc6() throws Exception {
        // Initialize the database
        abc6Repository.saveAndFlush(abc6);

        // Get the abc6
        restAbc6MockMvc
            .perform(get(ENTITY_API_URL_ID, abc6.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc6.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc6() throws Exception {
        // Get the abc6
        restAbc6MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc6() throws Exception {
        // Initialize the database
        abc6Repository.saveAndFlush(abc6);

        int databaseSizeBeforeUpdate = abc6Repository.findAll().size();

        // Update the abc6
        Abc6 updatedAbc6 = abc6Repository.findById(abc6.getId()).get();
        // Disconnect from session so that the updates on updatedAbc6 are not directly saved in db
        em.detach(updatedAbc6);
        updatedAbc6.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc6MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc6.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc6))
            )
            .andExpect(status().isOk());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeUpdate);
        Abc6 testAbc6 = abc6List.get(abc6List.size() - 1);
        assertThat(testAbc6.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc6.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc6() throws Exception {
        int databaseSizeBeforeUpdate = abc6Repository.findAll().size();
        abc6.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc6MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc6.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc6))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc6() throws Exception {
        int databaseSizeBeforeUpdate = abc6Repository.findAll().size();
        abc6.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc6MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc6))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc6() throws Exception {
        int databaseSizeBeforeUpdate = abc6Repository.findAll().size();
        abc6.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc6MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc6))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc6WithPatch() throws Exception {
        // Initialize the database
        abc6Repository.saveAndFlush(abc6);

        int databaseSizeBeforeUpdate = abc6Repository.findAll().size();

        // Update the abc6 using partial update
        Abc6 partialUpdatedAbc6 = new Abc6();
        partialUpdatedAbc6.setId(abc6.getId());

        partialUpdatedAbc6.name(UPDATED_NAME);

        restAbc6MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc6.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc6))
            )
            .andExpect(status().isOk());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeUpdate);
        Abc6 testAbc6 = abc6List.get(abc6List.size() - 1);
        assertThat(testAbc6.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc6.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc6WithPatch() throws Exception {
        // Initialize the database
        abc6Repository.saveAndFlush(abc6);

        int databaseSizeBeforeUpdate = abc6Repository.findAll().size();

        // Update the abc6 using partial update
        Abc6 partialUpdatedAbc6 = new Abc6();
        partialUpdatedAbc6.setId(abc6.getId());

        partialUpdatedAbc6.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc6MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc6.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc6))
            )
            .andExpect(status().isOk());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeUpdate);
        Abc6 testAbc6 = abc6List.get(abc6List.size() - 1);
        assertThat(testAbc6.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc6.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc6() throws Exception {
        int databaseSizeBeforeUpdate = abc6Repository.findAll().size();
        abc6.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc6MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc6.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc6))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc6() throws Exception {
        int databaseSizeBeforeUpdate = abc6Repository.findAll().size();
        abc6.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc6MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc6))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc6() throws Exception {
        int databaseSizeBeforeUpdate = abc6Repository.findAll().size();
        abc6.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc6MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc6))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc6 in the database
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc6() throws Exception {
        // Initialize the database
        abc6Repository.saveAndFlush(abc6);

        int databaseSizeBeforeDelete = abc6Repository.findAll().size();

        // Delete the abc6
        restAbc6MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc6.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc6> abc6List = abc6Repository.findAll();
        assertThat(abc6List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
