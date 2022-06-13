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
import sample.domain.Abc11;
import sample.repository.Abc11Repository;

/**
 * Integration tests for the {@link Abc11Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc11ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-11-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc11Repository abc11Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc11MockMvc;

    private Abc11 abc11;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc11 createEntity(EntityManager em) {
        Abc11 abc11 = new Abc11().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc11;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc11 createUpdatedEntity(EntityManager em) {
        Abc11 abc11 = new Abc11().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc11;
    }

    @BeforeEach
    public void initTest() {
        abc11 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc11() throws Exception {
        int databaseSizeBeforeCreate = abc11Repository.findAll().size();
        // Create the Abc11
        restAbc11MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc11))
            )
            .andExpect(status().isCreated());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeCreate + 1);
        Abc11 testAbc11 = abc11List.get(abc11List.size() - 1);
        assertThat(testAbc11.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc11.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc11WithExistingId() throws Exception {
        // Create the Abc11 with an existing ID
        abc11.setId(1L);

        int databaseSizeBeforeCreate = abc11Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc11MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc11))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc11Repository.findAll().size();
        // set the field null
        abc11.setName(null);

        // Create the Abc11, which fails.

        restAbc11MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc11))
            )
            .andExpect(status().isBadRequest());

        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc11s() throws Exception {
        // Initialize the database
        abc11Repository.saveAndFlush(abc11);

        // Get all the abc11List
        restAbc11MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc11.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc11() throws Exception {
        // Initialize the database
        abc11Repository.saveAndFlush(abc11);

        // Get the abc11
        restAbc11MockMvc
            .perform(get(ENTITY_API_URL_ID, abc11.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc11.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc11() throws Exception {
        // Get the abc11
        restAbc11MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc11() throws Exception {
        // Initialize the database
        abc11Repository.saveAndFlush(abc11);

        int databaseSizeBeforeUpdate = abc11Repository.findAll().size();

        // Update the abc11
        Abc11 updatedAbc11 = abc11Repository.findById(abc11.getId()).get();
        // Disconnect from session so that the updates on updatedAbc11 are not directly saved in db
        em.detach(updatedAbc11);
        updatedAbc11.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc11MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc11.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc11))
            )
            .andExpect(status().isOk());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeUpdate);
        Abc11 testAbc11 = abc11List.get(abc11List.size() - 1);
        assertThat(testAbc11.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc11.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc11() throws Exception {
        int databaseSizeBeforeUpdate = abc11Repository.findAll().size();
        abc11.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc11MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc11.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc11))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc11() throws Exception {
        int databaseSizeBeforeUpdate = abc11Repository.findAll().size();
        abc11.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc11MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc11))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc11() throws Exception {
        int databaseSizeBeforeUpdate = abc11Repository.findAll().size();
        abc11.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc11MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc11))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc11WithPatch() throws Exception {
        // Initialize the database
        abc11Repository.saveAndFlush(abc11);

        int databaseSizeBeforeUpdate = abc11Repository.findAll().size();

        // Update the abc11 using partial update
        Abc11 partialUpdatedAbc11 = new Abc11();
        partialUpdatedAbc11.setId(abc11.getId());

        partialUpdatedAbc11.name(UPDATED_NAME);

        restAbc11MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc11.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc11))
            )
            .andExpect(status().isOk());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeUpdate);
        Abc11 testAbc11 = abc11List.get(abc11List.size() - 1);
        assertThat(testAbc11.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc11.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc11WithPatch() throws Exception {
        // Initialize the database
        abc11Repository.saveAndFlush(abc11);

        int databaseSizeBeforeUpdate = abc11Repository.findAll().size();

        // Update the abc11 using partial update
        Abc11 partialUpdatedAbc11 = new Abc11();
        partialUpdatedAbc11.setId(abc11.getId());

        partialUpdatedAbc11.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc11MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc11.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc11))
            )
            .andExpect(status().isOk());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeUpdate);
        Abc11 testAbc11 = abc11List.get(abc11List.size() - 1);
        assertThat(testAbc11.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc11.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc11() throws Exception {
        int databaseSizeBeforeUpdate = abc11Repository.findAll().size();
        abc11.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc11MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc11.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc11))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc11() throws Exception {
        int databaseSizeBeforeUpdate = abc11Repository.findAll().size();
        abc11.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc11MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc11))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc11() throws Exception {
        int databaseSizeBeforeUpdate = abc11Repository.findAll().size();
        abc11.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc11MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc11))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc11 in the database
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc11() throws Exception {
        // Initialize the database
        abc11Repository.saveAndFlush(abc11);

        int databaseSizeBeforeDelete = abc11Repository.findAll().size();

        // Delete the abc11
        restAbc11MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc11.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc11> abc11List = abc11Repository.findAll();
        assertThat(abc11List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
