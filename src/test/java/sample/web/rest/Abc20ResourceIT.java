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
import sample.domain.Abc20;
import sample.repository.Abc20Repository;

/**
 * Integration tests for the {@link Abc20Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc20ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-20-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc20Repository abc20Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc20MockMvc;

    private Abc20 abc20;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc20 createEntity(EntityManager em) {
        Abc20 abc20 = new Abc20().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc20;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc20 createUpdatedEntity(EntityManager em) {
        Abc20 abc20 = new Abc20().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc20;
    }

    @BeforeEach
    public void initTest() {
        abc20 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc20() throws Exception {
        int databaseSizeBeforeCreate = abc20Repository.findAll().size();
        // Create the Abc20
        restAbc20MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc20))
            )
            .andExpect(status().isCreated());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeCreate + 1);
        Abc20 testAbc20 = abc20List.get(abc20List.size() - 1);
        assertThat(testAbc20.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc20.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc20WithExistingId() throws Exception {
        // Create the Abc20 with an existing ID
        abc20.setId(1L);

        int databaseSizeBeforeCreate = abc20Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc20MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc20))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc20Repository.findAll().size();
        // set the field null
        abc20.setName(null);

        // Create the Abc20, which fails.

        restAbc20MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc20))
            )
            .andExpect(status().isBadRequest());

        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc20s() throws Exception {
        // Initialize the database
        abc20Repository.saveAndFlush(abc20);

        // Get all the abc20List
        restAbc20MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc20.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc20() throws Exception {
        // Initialize the database
        abc20Repository.saveAndFlush(abc20);

        // Get the abc20
        restAbc20MockMvc
            .perform(get(ENTITY_API_URL_ID, abc20.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc20.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc20() throws Exception {
        // Get the abc20
        restAbc20MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc20() throws Exception {
        // Initialize the database
        abc20Repository.saveAndFlush(abc20);

        int databaseSizeBeforeUpdate = abc20Repository.findAll().size();

        // Update the abc20
        Abc20 updatedAbc20 = abc20Repository.findById(abc20.getId()).get();
        // Disconnect from session so that the updates on updatedAbc20 are not directly saved in db
        em.detach(updatedAbc20);
        updatedAbc20.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc20MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc20.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc20))
            )
            .andExpect(status().isOk());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeUpdate);
        Abc20 testAbc20 = abc20List.get(abc20List.size() - 1);
        assertThat(testAbc20.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc20.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc20() throws Exception {
        int databaseSizeBeforeUpdate = abc20Repository.findAll().size();
        abc20.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc20MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc20.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc20))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc20() throws Exception {
        int databaseSizeBeforeUpdate = abc20Repository.findAll().size();
        abc20.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc20MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc20))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc20() throws Exception {
        int databaseSizeBeforeUpdate = abc20Repository.findAll().size();
        abc20.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc20MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc20))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc20WithPatch() throws Exception {
        // Initialize the database
        abc20Repository.saveAndFlush(abc20);

        int databaseSizeBeforeUpdate = abc20Repository.findAll().size();

        // Update the abc20 using partial update
        Abc20 partialUpdatedAbc20 = new Abc20();
        partialUpdatedAbc20.setId(abc20.getId());

        partialUpdatedAbc20.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc20MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc20.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc20))
            )
            .andExpect(status().isOk());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeUpdate);
        Abc20 testAbc20 = abc20List.get(abc20List.size() - 1);
        assertThat(testAbc20.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc20.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc20WithPatch() throws Exception {
        // Initialize the database
        abc20Repository.saveAndFlush(abc20);

        int databaseSizeBeforeUpdate = abc20Repository.findAll().size();

        // Update the abc20 using partial update
        Abc20 partialUpdatedAbc20 = new Abc20();
        partialUpdatedAbc20.setId(abc20.getId());

        partialUpdatedAbc20.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc20MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc20.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc20))
            )
            .andExpect(status().isOk());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeUpdate);
        Abc20 testAbc20 = abc20List.get(abc20List.size() - 1);
        assertThat(testAbc20.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc20.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc20() throws Exception {
        int databaseSizeBeforeUpdate = abc20Repository.findAll().size();
        abc20.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc20MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc20.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc20))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc20() throws Exception {
        int databaseSizeBeforeUpdate = abc20Repository.findAll().size();
        abc20.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc20MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc20))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc20() throws Exception {
        int databaseSizeBeforeUpdate = abc20Repository.findAll().size();
        abc20.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc20MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc20))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc20 in the database
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc20() throws Exception {
        // Initialize the database
        abc20Repository.saveAndFlush(abc20);

        int databaseSizeBeforeDelete = abc20Repository.findAll().size();

        // Delete the abc20
        restAbc20MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc20.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc20> abc20List = abc20Repository.findAll();
        assertThat(abc20List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
