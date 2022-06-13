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
import sample.domain.Abc15;
import sample.repository.Abc15Repository;

/**
 * Integration tests for the {@link Abc15Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc15ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-15-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc15Repository abc15Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc15MockMvc;

    private Abc15 abc15;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc15 createEntity(EntityManager em) {
        Abc15 abc15 = new Abc15().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc15;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc15 createUpdatedEntity(EntityManager em) {
        Abc15 abc15 = new Abc15().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc15;
    }

    @BeforeEach
    public void initTest() {
        abc15 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc15() throws Exception {
        int databaseSizeBeforeCreate = abc15Repository.findAll().size();
        // Create the Abc15
        restAbc15MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc15))
            )
            .andExpect(status().isCreated());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeCreate + 1);
        Abc15 testAbc15 = abc15List.get(abc15List.size() - 1);
        assertThat(testAbc15.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc15.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc15WithExistingId() throws Exception {
        // Create the Abc15 with an existing ID
        abc15.setId(1L);

        int databaseSizeBeforeCreate = abc15Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc15MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc15))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc15Repository.findAll().size();
        // set the field null
        abc15.setName(null);

        // Create the Abc15, which fails.

        restAbc15MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc15))
            )
            .andExpect(status().isBadRequest());

        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc15s() throws Exception {
        // Initialize the database
        abc15Repository.saveAndFlush(abc15);

        // Get all the abc15List
        restAbc15MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc15.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc15() throws Exception {
        // Initialize the database
        abc15Repository.saveAndFlush(abc15);

        // Get the abc15
        restAbc15MockMvc
            .perform(get(ENTITY_API_URL_ID, abc15.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc15.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc15() throws Exception {
        // Get the abc15
        restAbc15MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc15() throws Exception {
        // Initialize the database
        abc15Repository.saveAndFlush(abc15);

        int databaseSizeBeforeUpdate = abc15Repository.findAll().size();

        // Update the abc15
        Abc15 updatedAbc15 = abc15Repository.findById(abc15.getId()).get();
        // Disconnect from session so that the updates on updatedAbc15 are not directly saved in db
        em.detach(updatedAbc15);
        updatedAbc15.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc15MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc15.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc15))
            )
            .andExpect(status().isOk());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeUpdate);
        Abc15 testAbc15 = abc15List.get(abc15List.size() - 1);
        assertThat(testAbc15.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc15.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc15() throws Exception {
        int databaseSizeBeforeUpdate = abc15Repository.findAll().size();
        abc15.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc15MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc15.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc15))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc15() throws Exception {
        int databaseSizeBeforeUpdate = abc15Repository.findAll().size();
        abc15.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc15MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc15))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc15() throws Exception {
        int databaseSizeBeforeUpdate = abc15Repository.findAll().size();
        abc15.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc15MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc15))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc15WithPatch() throws Exception {
        // Initialize the database
        abc15Repository.saveAndFlush(abc15);

        int databaseSizeBeforeUpdate = abc15Repository.findAll().size();

        // Update the abc15 using partial update
        Abc15 partialUpdatedAbc15 = new Abc15();
        partialUpdatedAbc15.setId(abc15.getId());

        partialUpdatedAbc15.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc15MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc15.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc15))
            )
            .andExpect(status().isOk());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeUpdate);
        Abc15 testAbc15 = abc15List.get(abc15List.size() - 1);
        assertThat(testAbc15.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc15.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc15WithPatch() throws Exception {
        // Initialize the database
        abc15Repository.saveAndFlush(abc15);

        int databaseSizeBeforeUpdate = abc15Repository.findAll().size();

        // Update the abc15 using partial update
        Abc15 partialUpdatedAbc15 = new Abc15();
        partialUpdatedAbc15.setId(abc15.getId());

        partialUpdatedAbc15.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc15MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc15.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc15))
            )
            .andExpect(status().isOk());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeUpdate);
        Abc15 testAbc15 = abc15List.get(abc15List.size() - 1);
        assertThat(testAbc15.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc15.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc15() throws Exception {
        int databaseSizeBeforeUpdate = abc15Repository.findAll().size();
        abc15.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc15MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc15.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc15))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc15() throws Exception {
        int databaseSizeBeforeUpdate = abc15Repository.findAll().size();
        abc15.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc15MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc15))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc15() throws Exception {
        int databaseSizeBeforeUpdate = abc15Repository.findAll().size();
        abc15.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc15MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc15))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc15 in the database
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc15() throws Exception {
        // Initialize the database
        abc15Repository.saveAndFlush(abc15);

        int databaseSizeBeforeDelete = abc15Repository.findAll().size();

        // Delete the abc15
        restAbc15MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc15.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc15> abc15List = abc15Repository.findAll();
        assertThat(abc15List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
