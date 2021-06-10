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
import sample.domain.Abc;
import sample.repository.AbcRepository;

/**
 * Integration tests for the {@link AbcResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AbcResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abcs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AbcRepository abcRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbcMockMvc;

    private Abc abc;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc createEntity(EntityManager em) {
        Abc abc = new Abc().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc createUpdatedEntity(EntityManager em) {
        Abc abc = new Abc().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc;
    }

    @BeforeEach
    public void initTest() {
        abc = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc() throws Exception {
        int databaseSizeBeforeCreate = abcRepository.findAll().size();
        // Create the Abc
        restAbcMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc))
            )
            .andExpect(status().isCreated());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeCreate + 1);
        Abc testAbc = abcList.get(abcList.size() - 1);
        assertThat(testAbc.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbcWithExistingId() throws Exception {
        // Create the Abc with an existing ID
        abc.setId(1L);

        int databaseSizeBeforeCreate = abcRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbcMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abcRepository.findAll().size();
        // set the field null
        abc.setName(null);

        // Create the Abc, which fails.

        restAbcMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc))
            )
            .andExpect(status().isBadRequest());

        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbcs() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        // Get all the abcList
        restAbcMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        // Get the abc
        restAbcMockMvc
            .perform(get(ENTITY_API_URL_ID, abc.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc() throws Exception {
        // Get the abc
        restAbcMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        int databaseSizeBeforeUpdate = abcRepository.findAll().size();

        // Update the abc
        Abc updatedAbc = abcRepository.findById(abc.getId()).get();
        // Disconnect from session so that the updates on updatedAbc are not directly saved in db
        em.detach(updatedAbc);
        updatedAbc.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbcMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc))
            )
            .andExpect(status().isOk());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeUpdate);
        Abc testAbc = abcList.get(abcList.size() - 1);
        assertThat(testAbc.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc() throws Exception {
        int databaseSizeBeforeUpdate = abcRepository.findAll().size();
        abc.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbcMockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc() throws Exception {
        int databaseSizeBeforeUpdate = abcRepository.findAll().size();
        abc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbcMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc() throws Exception {
        int databaseSizeBeforeUpdate = abcRepository.findAll().size();
        abc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbcMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbcWithPatch() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        int databaseSizeBeforeUpdate = abcRepository.findAll().size();

        // Update the abc using partial update
        Abc partialUpdatedAbc = new Abc();
        partialUpdatedAbc.setId(abc.getId());

        partialUpdatedAbc.name(UPDATED_NAME);

        restAbcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc))
            )
            .andExpect(status().isOk());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeUpdate);
        Abc testAbc = abcList.get(abcList.size() - 1);
        assertThat(testAbc.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbcWithPatch() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        int databaseSizeBeforeUpdate = abcRepository.findAll().size();

        // Update the abc using partial update
        Abc partialUpdatedAbc = new Abc();
        partialUpdatedAbc.setId(abc.getId());

        partialUpdatedAbc.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc))
            )
            .andExpect(status().isOk());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeUpdate);
        Abc testAbc = abcList.get(abcList.size() - 1);
        assertThat(testAbc.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc() throws Exception {
        int databaseSizeBeforeUpdate = abcRepository.findAll().size();
        abc.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc() throws Exception {
        int databaseSizeBeforeUpdate = abcRepository.findAll().size();
        abc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbcMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc() throws Exception {
        int databaseSizeBeforeUpdate = abcRepository.findAll().size();
        abc.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbcMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        int databaseSizeBeforeDelete = abcRepository.findAll().size();

        // Delete the abc
        restAbcMockMvc
            .perform(delete(ENTITY_API_URL_ID, abc.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
