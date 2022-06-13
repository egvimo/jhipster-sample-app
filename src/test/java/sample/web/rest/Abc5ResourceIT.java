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
import sample.domain.Abc5;
import sample.repository.Abc5Repository;

/**
 * Integration tests for the {@link Abc5Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc5ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-5-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc5Repository abc5Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc5MockMvc;

    private Abc5 abc5;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc5 createEntity(EntityManager em) {
        Abc5 abc5 = new Abc5().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc5;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc5 createUpdatedEntity(EntityManager em) {
        Abc5 abc5 = new Abc5().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc5;
    }

    @BeforeEach
    public void initTest() {
        abc5 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc5() throws Exception {
        int databaseSizeBeforeCreate = abc5Repository.findAll().size();
        // Create the Abc5
        restAbc5MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc5))
            )
            .andExpect(status().isCreated());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeCreate + 1);
        Abc5 testAbc5 = abc5List.get(abc5List.size() - 1);
        assertThat(testAbc5.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc5.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc5WithExistingId() throws Exception {
        // Create the Abc5 with an existing ID
        abc5.setId(1L);

        int databaseSizeBeforeCreate = abc5Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc5MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc5))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc5Repository.findAll().size();
        // set the field null
        abc5.setName(null);

        // Create the Abc5, which fails.

        restAbc5MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc5))
            )
            .andExpect(status().isBadRequest());

        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc5s() throws Exception {
        // Initialize the database
        abc5Repository.saveAndFlush(abc5);

        // Get all the abc5List
        restAbc5MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc5.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc5() throws Exception {
        // Initialize the database
        abc5Repository.saveAndFlush(abc5);

        // Get the abc5
        restAbc5MockMvc
            .perform(get(ENTITY_API_URL_ID, abc5.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc5.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc5() throws Exception {
        // Get the abc5
        restAbc5MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc5() throws Exception {
        // Initialize the database
        abc5Repository.saveAndFlush(abc5);

        int databaseSizeBeforeUpdate = abc5Repository.findAll().size();

        // Update the abc5
        Abc5 updatedAbc5 = abc5Repository.findById(abc5.getId()).get();
        // Disconnect from session so that the updates on updatedAbc5 are not directly saved in db
        em.detach(updatedAbc5);
        updatedAbc5.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc5MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc5.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc5))
            )
            .andExpect(status().isOk());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeUpdate);
        Abc5 testAbc5 = abc5List.get(abc5List.size() - 1);
        assertThat(testAbc5.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc5.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc5() throws Exception {
        int databaseSizeBeforeUpdate = abc5Repository.findAll().size();
        abc5.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc5MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc5.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc5))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc5() throws Exception {
        int databaseSizeBeforeUpdate = abc5Repository.findAll().size();
        abc5.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc5MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc5))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc5() throws Exception {
        int databaseSizeBeforeUpdate = abc5Repository.findAll().size();
        abc5.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc5MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc5))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc5WithPatch() throws Exception {
        // Initialize the database
        abc5Repository.saveAndFlush(abc5);

        int databaseSizeBeforeUpdate = abc5Repository.findAll().size();

        // Update the abc5 using partial update
        Abc5 partialUpdatedAbc5 = new Abc5();
        partialUpdatedAbc5.setId(abc5.getId());

        restAbc5MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc5.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc5))
            )
            .andExpect(status().isOk());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeUpdate);
        Abc5 testAbc5 = abc5List.get(abc5List.size() - 1);
        assertThat(testAbc5.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc5.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc5WithPatch() throws Exception {
        // Initialize the database
        abc5Repository.saveAndFlush(abc5);

        int databaseSizeBeforeUpdate = abc5Repository.findAll().size();

        // Update the abc5 using partial update
        Abc5 partialUpdatedAbc5 = new Abc5();
        partialUpdatedAbc5.setId(abc5.getId());

        partialUpdatedAbc5.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc5MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc5.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc5))
            )
            .andExpect(status().isOk());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeUpdate);
        Abc5 testAbc5 = abc5List.get(abc5List.size() - 1);
        assertThat(testAbc5.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc5.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc5() throws Exception {
        int databaseSizeBeforeUpdate = abc5Repository.findAll().size();
        abc5.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc5MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc5.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc5))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc5() throws Exception {
        int databaseSizeBeforeUpdate = abc5Repository.findAll().size();
        abc5.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc5MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc5))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc5() throws Exception {
        int databaseSizeBeforeUpdate = abc5Repository.findAll().size();
        abc5.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc5MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc5))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc5 in the database
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc5() throws Exception {
        // Initialize the database
        abc5Repository.saveAndFlush(abc5);

        int databaseSizeBeforeDelete = abc5Repository.findAll().size();

        // Delete the abc5
        restAbc5MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc5.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc5> abc5List = abc5Repository.findAll();
        assertThat(abc5List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
