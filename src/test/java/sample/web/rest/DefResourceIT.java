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
import sample.domain.Def;
import sample.repository.DefRepository;

/**
 * Integration tests for the {@link DefResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DefResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/defs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private DefRepository defRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDefMockMvc;

    private Def def;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Def createEntity(EntityManager em) {
        Def def = new Def().name(DEFAULT_NAME);
        return def;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Def createUpdatedEntity(EntityManager em) {
        Def def = new Def().name(UPDATED_NAME);
        return def;
    }

    @BeforeEach
    public void initTest() {
        def = createEntity(em);
    }

    @Test
    @Transactional
    void createDef() throws Exception {
        int databaseSizeBeforeCreate = defRepository.findAll().size();
        // Create the Def
        restDefMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(def))
            )
            .andExpect(status().isCreated());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeCreate + 1);
        Def testDef = defList.get(defList.size() - 1);
        assertThat(testDef.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createDefWithExistingId() throws Exception {
        // Create the Def with an existing ID
        def.setId(1L);

        int databaseSizeBeforeCreate = defRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDefMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(def))
            )
            .andExpect(status().isBadRequest());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDefs() throws Exception {
        // Initialize the database
        defRepository.saveAndFlush(def);

        // Get all the defList
        restDefMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(def.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getDef() throws Exception {
        // Initialize the database
        defRepository.saveAndFlush(def);

        // Get the def
        restDefMockMvc
            .perform(get(ENTITY_API_URL_ID, def.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(def.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingDef() throws Exception {
        // Get the def
        restDefMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewDef() throws Exception {
        // Initialize the database
        defRepository.saveAndFlush(def);

        int databaseSizeBeforeUpdate = defRepository.findAll().size();

        // Update the def
        Def updatedDef = defRepository.findById(def.getId()).get();
        // Disconnect from session so that the updates on updatedDef are not directly saved in db
        em.detach(updatedDef);
        updatedDef.name(UPDATED_NAME);

        restDefMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDef.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedDef))
            )
            .andExpect(status().isOk());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeUpdate);
        Def testDef = defList.get(defList.size() - 1);
        assertThat(testDef.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingDef() throws Exception {
        int databaseSizeBeforeUpdate = defRepository.findAll().size();
        def.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDefMockMvc
            .perform(
                put(ENTITY_API_URL_ID, def.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(def))
            )
            .andExpect(status().isBadRequest());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDef() throws Exception {
        int databaseSizeBeforeUpdate = defRepository.findAll().size();
        def.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDefMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(def))
            )
            .andExpect(status().isBadRequest());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDef() throws Exception {
        int databaseSizeBeforeUpdate = defRepository.findAll().size();
        def.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDefMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(def))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDefWithPatch() throws Exception {
        // Initialize the database
        defRepository.saveAndFlush(def);

        int databaseSizeBeforeUpdate = defRepository.findAll().size();

        // Update the def using partial update
        Def partialUpdatedDef = new Def();
        partialUpdatedDef.setId(def.getId());

        restDefMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDef.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDef))
            )
            .andExpect(status().isOk());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeUpdate);
        Def testDef = defList.get(defList.size() - 1);
        assertThat(testDef.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateDefWithPatch() throws Exception {
        // Initialize the database
        defRepository.saveAndFlush(def);

        int databaseSizeBeforeUpdate = defRepository.findAll().size();

        // Update the def using partial update
        Def partialUpdatedDef = new Def();
        partialUpdatedDef.setId(def.getId());

        partialUpdatedDef.name(UPDATED_NAME);

        restDefMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDef.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedDef))
            )
            .andExpect(status().isOk());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeUpdate);
        Def testDef = defList.get(defList.size() - 1);
        assertThat(testDef.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingDef() throws Exception {
        int databaseSizeBeforeUpdate = defRepository.findAll().size();
        def.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDefMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, def.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(def))
            )
            .andExpect(status().isBadRequest());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDef() throws Exception {
        int databaseSizeBeforeUpdate = defRepository.findAll().size();
        def.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDefMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(def))
            )
            .andExpect(status().isBadRequest());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDef() throws Exception {
        int databaseSizeBeforeUpdate = defRepository.findAll().size();
        def.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDefMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(def))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Def in the database
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDef() throws Exception {
        // Initialize the database
        defRepository.saveAndFlush(def);

        int databaseSizeBeforeDelete = defRepository.findAll().size();

        // Delete the def
        restDefMockMvc
            .perform(delete(ENTITY_API_URL_ID, def.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Def> defList = defRepository.findAll();
        assertThat(defList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
