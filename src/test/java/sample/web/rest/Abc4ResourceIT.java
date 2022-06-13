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
import sample.domain.Abc4;
import sample.repository.Abc4Repository;

/**
 * Integration tests for the {@link Abc4Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc4ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-4-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc4Repository abc4Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc4MockMvc;

    private Abc4 abc4;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc4 createEntity(EntityManager em) {
        Abc4 abc4 = new Abc4().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc4;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc4 createUpdatedEntity(EntityManager em) {
        Abc4 abc4 = new Abc4().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc4;
    }

    @BeforeEach
    public void initTest() {
        abc4 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc4() throws Exception {
        int databaseSizeBeforeCreate = abc4Repository.findAll().size();
        // Create the Abc4
        restAbc4MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc4))
            )
            .andExpect(status().isCreated());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeCreate + 1);
        Abc4 testAbc4 = abc4List.get(abc4List.size() - 1);
        assertThat(testAbc4.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc4.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc4WithExistingId() throws Exception {
        // Create the Abc4 with an existing ID
        abc4.setId(1L);

        int databaseSizeBeforeCreate = abc4Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc4MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc4))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc4Repository.findAll().size();
        // set the field null
        abc4.setName(null);

        // Create the Abc4, which fails.

        restAbc4MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc4))
            )
            .andExpect(status().isBadRequest());

        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc4s() throws Exception {
        // Initialize the database
        abc4Repository.saveAndFlush(abc4);

        // Get all the abc4List
        restAbc4MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc4.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc4() throws Exception {
        // Initialize the database
        abc4Repository.saveAndFlush(abc4);

        // Get the abc4
        restAbc4MockMvc
            .perform(get(ENTITY_API_URL_ID, abc4.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc4.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc4() throws Exception {
        // Get the abc4
        restAbc4MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc4() throws Exception {
        // Initialize the database
        abc4Repository.saveAndFlush(abc4);

        int databaseSizeBeforeUpdate = abc4Repository.findAll().size();

        // Update the abc4
        Abc4 updatedAbc4 = abc4Repository.findById(abc4.getId()).get();
        // Disconnect from session so that the updates on updatedAbc4 are not directly saved in db
        em.detach(updatedAbc4);
        updatedAbc4.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc4MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc4.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc4))
            )
            .andExpect(status().isOk());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeUpdate);
        Abc4 testAbc4 = abc4List.get(abc4List.size() - 1);
        assertThat(testAbc4.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc4.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc4() throws Exception {
        int databaseSizeBeforeUpdate = abc4Repository.findAll().size();
        abc4.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc4MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc4.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc4))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc4() throws Exception {
        int databaseSizeBeforeUpdate = abc4Repository.findAll().size();
        abc4.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc4MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc4))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc4() throws Exception {
        int databaseSizeBeforeUpdate = abc4Repository.findAll().size();
        abc4.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc4MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc4))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc4WithPatch() throws Exception {
        // Initialize the database
        abc4Repository.saveAndFlush(abc4);

        int databaseSizeBeforeUpdate = abc4Repository.findAll().size();

        // Update the abc4 using partial update
        Abc4 partialUpdatedAbc4 = new Abc4();
        partialUpdatedAbc4.setId(abc4.getId());

        partialUpdatedAbc4.name(UPDATED_NAME);

        restAbc4MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc4.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc4))
            )
            .andExpect(status().isOk());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeUpdate);
        Abc4 testAbc4 = abc4List.get(abc4List.size() - 1);
        assertThat(testAbc4.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc4.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc4WithPatch() throws Exception {
        // Initialize the database
        abc4Repository.saveAndFlush(abc4);

        int databaseSizeBeforeUpdate = abc4Repository.findAll().size();

        // Update the abc4 using partial update
        Abc4 partialUpdatedAbc4 = new Abc4();
        partialUpdatedAbc4.setId(abc4.getId());

        partialUpdatedAbc4.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc4MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc4.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc4))
            )
            .andExpect(status().isOk());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeUpdate);
        Abc4 testAbc4 = abc4List.get(abc4List.size() - 1);
        assertThat(testAbc4.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc4.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc4() throws Exception {
        int databaseSizeBeforeUpdate = abc4Repository.findAll().size();
        abc4.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc4MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc4.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc4))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc4() throws Exception {
        int databaseSizeBeforeUpdate = abc4Repository.findAll().size();
        abc4.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc4MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc4))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc4() throws Exception {
        int databaseSizeBeforeUpdate = abc4Repository.findAll().size();
        abc4.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc4MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc4))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc4 in the database
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc4() throws Exception {
        // Initialize the database
        abc4Repository.saveAndFlush(abc4);

        int databaseSizeBeforeDelete = abc4Repository.findAll().size();

        // Delete the abc4
        restAbc4MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc4.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc4> abc4List = abc4Repository.findAll();
        assertThat(abc4List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
