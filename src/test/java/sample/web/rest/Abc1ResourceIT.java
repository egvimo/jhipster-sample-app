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
import sample.domain.Abc1;
import sample.repository.Abc1Repository;

/**
 * Integration tests for the {@link Abc1Resource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class Abc1ResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_OTHER_FIELD = "AAAAAAAAAA";
    private static final String UPDATED_OTHER_FIELD = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/abc-1-s";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private Abc1Repository abc1Repository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAbc1MockMvc;

    private Abc1 abc1;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc1 createEntity(EntityManager em) {
        Abc1 abc1 = new Abc1().name(DEFAULT_NAME).otherField(DEFAULT_OTHER_FIELD);
        return abc1;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc1 createUpdatedEntity(EntityManager em) {
        Abc1 abc1 = new Abc1().name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);
        return abc1;
    }

    @BeforeEach
    public void initTest() {
        abc1 = createEntity(em);
    }

    @Test
    @Transactional
    void createAbc1() throws Exception {
        int databaseSizeBeforeCreate = abc1Repository.findAll().size();
        // Create the Abc1
        restAbc1MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc1))
            )
            .andExpect(status().isCreated());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeCreate + 1);
        Abc1 testAbc1 = abc1List.get(abc1List.size() - 1);
        assertThat(testAbc1.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc1.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void createAbc1WithExistingId() throws Exception {
        // Create the Abc1 with an existing ID
        abc1.setId(1L);

        int databaseSizeBeforeCreate = abc1Repository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbc1MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc1))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = abc1Repository.findAll().size();
        // set the field null
        abc1.setName(null);

        // Create the Abc1, which fails.

        restAbc1MockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc1))
            )
            .andExpect(status().isBadRequest());

        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllAbc1s() throws Exception {
        // Initialize the database
        abc1Repository.saveAndFlush(abc1);

        // Get all the abc1List
        restAbc1MockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc1.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].otherField").value(hasItem(DEFAULT_OTHER_FIELD)));
    }

    @Test
    @Transactional
    void getAbc1() throws Exception {
        // Initialize the database
        abc1Repository.saveAndFlush(abc1);

        // Get the abc1
        restAbc1MockMvc
            .perform(get(ENTITY_API_URL_ID, abc1.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc1.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.otherField").value(DEFAULT_OTHER_FIELD));
    }

    @Test
    @Transactional
    void getNonExistingAbc1() throws Exception {
        // Get the abc1
        restAbc1MockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAbc1() throws Exception {
        // Initialize the database
        abc1Repository.saveAndFlush(abc1);

        int databaseSizeBeforeUpdate = abc1Repository.findAll().size();

        // Update the abc1
        Abc1 updatedAbc1 = abc1Repository.findById(abc1.getId()).get();
        // Disconnect from session so that the updates on updatedAbc1 are not directly saved in db
        em.detach(updatedAbc1);
        updatedAbc1.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc1MockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAbc1.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAbc1))
            )
            .andExpect(status().isOk());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeUpdate);
        Abc1 testAbc1 = abc1List.get(abc1List.size() - 1);
        assertThat(testAbc1.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc1.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void putNonExistingAbc1() throws Exception {
        int databaseSizeBeforeUpdate = abc1Repository.findAll().size();
        abc1.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc1MockMvc
            .perform(
                put(ENTITY_API_URL_ID, abc1.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc1))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAbc1() throws Exception {
        int databaseSizeBeforeUpdate = abc1Repository.findAll().size();
        abc1.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc1MockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(abc1))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAbc1() throws Exception {
        int databaseSizeBeforeUpdate = abc1Repository.findAll().size();
        abc1.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc1MockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc1))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAbc1WithPatch() throws Exception {
        // Initialize the database
        abc1Repository.saveAndFlush(abc1);

        int databaseSizeBeforeUpdate = abc1Repository.findAll().size();

        // Update the abc1 using partial update
        Abc1 partialUpdatedAbc1 = new Abc1();
        partialUpdatedAbc1.setId(abc1.getId());

        restAbc1MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc1.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc1))
            )
            .andExpect(status().isOk());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeUpdate);
        Abc1 testAbc1 = abc1List.get(abc1List.size() - 1);
        assertThat(testAbc1.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAbc1.getOtherField()).isEqualTo(DEFAULT_OTHER_FIELD);
    }

    @Test
    @Transactional
    void fullUpdateAbc1WithPatch() throws Exception {
        // Initialize the database
        abc1Repository.saveAndFlush(abc1);

        int databaseSizeBeforeUpdate = abc1Repository.findAll().size();

        // Update the abc1 using partial update
        Abc1 partialUpdatedAbc1 = new Abc1();
        partialUpdatedAbc1.setId(abc1.getId());

        partialUpdatedAbc1.name(UPDATED_NAME).otherField(UPDATED_OTHER_FIELD);

        restAbc1MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAbc1.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc1))
            )
            .andExpect(status().isOk());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeUpdate);
        Abc1 testAbc1 = abc1List.get(abc1List.size() - 1);
        assertThat(testAbc1.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAbc1.getOtherField()).isEqualTo(UPDATED_OTHER_FIELD);
    }

    @Test
    @Transactional
    void patchNonExistingAbc1() throws Exception {
        int databaseSizeBeforeUpdate = abc1Repository.findAll().size();
        abc1.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbc1MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, abc1.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc1))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAbc1() throws Exception {
        int databaseSizeBeforeUpdate = abc1Repository.findAll().size();
        abc1.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc1MockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc1))
            )
            .andExpect(status().isBadRequest());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAbc1() throws Exception {
        int databaseSizeBeforeUpdate = abc1Repository.findAll().size();
        abc1.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAbc1MockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(abc1))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Abc1 in the database
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAbc1() throws Exception {
        // Initialize the database
        abc1Repository.saveAndFlush(abc1);

        int databaseSizeBeforeDelete = abc1Repository.findAll().size();

        // Delete the abc1
        restAbc1MockMvc
            .perform(delete(ENTITY_API_URL_ID, abc1.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc1> abc1List = abc1Repository.findAll();
        assertThat(abc1List).hasSize(databaseSizeBeforeDelete - 1);
    }
}
