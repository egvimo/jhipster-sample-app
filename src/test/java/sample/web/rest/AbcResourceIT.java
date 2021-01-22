package sample.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
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
import sample.domain.Abc;
import sample.repository.AbcRepository;
import sample.service.AbcQueryService;
import sample.service.dto.AbcCriteria;

/**
 * Integration tests for the {@link AbcResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AbcResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    @Autowired
    private AbcRepository abcRepository;

    @Autowired
    private AbcQueryService abcQueryService;

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
        Abc abc = new Abc().name(DEFAULT_NAME);
        return abc;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Abc createUpdatedEntity(EntityManager em) {
        Abc abc = new Abc().name(UPDATED_NAME);
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
            .perform(post("/api/abcs").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc)))
            .andExpect(status().isCreated());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeCreate + 1);
        Abc testAbc = abcList.get(abcList.size() - 1);
        assertThat(testAbc.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createAbcWithExistingId() throws Exception {
        // Create the Abc with an existing ID
        abc.setId(1L);

        int databaseSizeBeforeCreate = abcRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAbcMockMvc
            .perform(post("/api/abcs").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc)))
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
            .perform(post("/api/abcs").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc)))
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
            .perform(get("/api/abcs?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getAbc() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        // Get the abc
        restAbcMockMvc
            .perform(get("/api/abcs/{id}", abc.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(abc.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getAbcsByIdFiltering() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        Long id = abc.getId();

        defaultAbcShouldBeFound("id.equals=" + id);
        defaultAbcShouldNotBeFound("id.notEquals=" + id);

        defaultAbcShouldBeFound("id.greaterThanOrEqual=" + id);
        defaultAbcShouldNotBeFound("id.greaterThan=" + id);

        defaultAbcShouldBeFound("id.lessThanOrEqual=" + id);
        defaultAbcShouldNotBeFound("id.lessThan=" + id);
    }

    @Test
    @Transactional
    void getAllAbcsByNameIsEqualToSomething() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        // Get all the abcList where name equals to DEFAULT_NAME
        defaultAbcShouldBeFound("name.equals=" + DEFAULT_NAME);

        // Get all the abcList where name equals to UPDATED_NAME
        defaultAbcShouldNotBeFound("name.equals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllAbcsByNameIsNotEqualToSomething() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        // Get all the abcList where name not equals to DEFAULT_NAME
        defaultAbcShouldNotBeFound("name.notEquals=" + DEFAULT_NAME);

        // Get all the abcList where name not equals to UPDATED_NAME
        defaultAbcShouldBeFound("name.notEquals=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllAbcsByNameIsInShouldWork() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        // Get all the abcList where name in DEFAULT_NAME or UPDATED_NAME
        defaultAbcShouldBeFound("name.in=" + DEFAULT_NAME + "," + UPDATED_NAME);

        // Get all the abcList where name equals to UPDATED_NAME
        defaultAbcShouldNotBeFound("name.in=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllAbcsByNameIsNullOrNotNull() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        // Get all the abcList where name is not null
        defaultAbcShouldBeFound("name.specified=true");

        // Get all the abcList where name is null
        defaultAbcShouldNotBeFound("name.specified=false");
    }

    @Test
    @Transactional
    void getAllAbcsByNameContainsSomething() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        // Get all the abcList where name contains DEFAULT_NAME
        defaultAbcShouldBeFound("name.contains=" + DEFAULT_NAME);

        // Get all the abcList where name contains UPDATED_NAME
        defaultAbcShouldNotBeFound("name.contains=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllAbcsByNameNotContainsSomething() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        // Get all the abcList where name does not contain DEFAULT_NAME
        defaultAbcShouldNotBeFound("name.doesNotContain=" + DEFAULT_NAME);

        // Get all the abcList where name does not contain UPDATED_NAME
        defaultAbcShouldBeFound("name.doesNotContain=" + UPDATED_NAME);
    }

    @Test
    @Transactional
    void getAllAbcsByParentIsEqualToSomething() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);
        Abc parent = AbcResourceIT.createEntity(em);
        em.persist(parent);
        em.flush();
        abc.setParent(parent);
        abcRepository.saveAndFlush(abc);
        Long parentId = parent.getId();

        // Get all the abcList where parent equals to parentId
        defaultAbcShouldBeFound("parentId.equals=" + parentId);

        // Get all the abcList where parent equals to parentId + 1
        defaultAbcShouldNotBeFound("parentId.equals=" + (parentId + 1));
    }

    @Test
    @Transactional
    void getAllAbcsByChildrenIsEqualToSomething() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);
        Abc children = AbcResourceIT.createEntity(em);
        em.persist(children);
        em.flush();
        abc.addChildren(children);
        abcRepository.saveAndFlush(abc);
        Long childrenId = children.getId();

        // Get all the abcList where children equals to childrenId
        defaultAbcShouldBeFound("childrenId.equals=" + childrenId);

        // Get all the abcList where children equals to childrenId + 1
        defaultAbcShouldNotBeFound("childrenId.equals=" + (childrenId + 1));
    }

    /**
     * Executes the search, and checks that the default entity is returned.
     */
    private void defaultAbcShouldBeFound(String filter) throws Exception {
        restAbcMockMvc
            .perform(get("/api/abcs?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(abc.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));

        // Check, that the count call also returns 1
        restAbcMockMvc
            .perform(get("/api/abcs/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("1"));
    }

    /**
     * Executes the search, and checks that the default entity is not returned.
     */
    private void defaultAbcShouldNotBeFound(String filter) throws Exception {
        restAbcMockMvc
            .perform(get("/api/abcs?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$").isArray())
            .andExpect(jsonPath("$").isEmpty());

        // Check, that the count call also returns 0
        restAbcMockMvc
            .perform(get("/api/abcs/count?sort=id,desc&" + filter))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(content().string("0"));
    }

    @Test
    @Transactional
    void getNonExistingAbc() throws Exception {
        // Get the abc
        restAbcMockMvc.perform(get("/api/abcs/{id}", Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void updateAbc() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        int databaseSizeBeforeUpdate = abcRepository.findAll().size();

        // Update the abc
        Abc updatedAbc = abcRepository.findById(abc.getId()).get();
        // Disconnect from session so that the updates on updatedAbc are not directly saved in db
        em.detach(updatedAbc);
        updatedAbc.name(UPDATED_NAME);

        restAbcMockMvc
            .perform(
                put("/api/abcs").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(updatedAbc))
            )
            .andExpect(status().isOk());

        // Validate the Abc in the database
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeUpdate);
        Abc testAbc = abcList.get(abcList.size() - 1);
        assertThat(testAbc.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void updateNonExistingAbc() throws Exception {
        int databaseSizeBeforeUpdate = abcRepository.findAll().size();

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAbcMockMvc
            .perform(put("/api/abcs").with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(abc)))
            .andExpect(status().isBadRequest());

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
                patch("/api/abcs")
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

        partialUpdatedAbc.name(UPDATED_NAME);

        restAbcMockMvc
            .perform(
                patch("/api/abcs")
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
    }

    @Test
    @Transactional
    void partialUpdateAbcShouldThrown() throws Exception {
        // Update the abc without id should throw
        Abc partialUpdatedAbc = new Abc();

        restAbcMockMvc
            .perform(
                patch("/api/abcs")
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAbc))
            )
            .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    void deleteAbc() throws Exception {
        // Initialize the database
        abcRepository.saveAndFlush(abc);

        int databaseSizeBeforeDelete = abcRepository.findAll().size();

        // Delete the abc
        restAbcMockMvc
            .perform(delete("/api/abcs/{id}", abc.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Abc> abcList = abcRepository.findAll();
        assertThat(abcList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
