package sample.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sample.domain.Abc25;
import sample.repository.Abc25Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc25}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc25Resource {

    private final Logger log = LoggerFactory.getLogger(Abc25Resource.class);

    private static final String ENTITY_NAME = "abc25";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc25Repository abc25Repository;

    public Abc25Resource(Abc25Repository abc25Repository) {
        this.abc25Repository = abc25Repository;
    }

    /**
     * {@code POST  /abc-25-s} : Create a new abc25.
     *
     * @param abc25 the abc25 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc25, or with status {@code 400 (Bad Request)} if the abc25 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-25-s")
    public ResponseEntity<Abc25> createAbc25(@Valid @RequestBody Abc25 abc25) throws URISyntaxException {
        log.debug("REST request to save Abc25 : {}", abc25);
        if (abc25.getId() != null) {
            throw new BadRequestAlertException("A new abc25 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc25 result = abc25Repository.save(abc25);
        return ResponseEntity
            .created(new URI("/api/abc-25-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-25-s/:id} : Updates an existing abc25.
     *
     * @param id the id of the abc25 to save.
     * @param abc25 the abc25 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc25,
     * or with status {@code 400 (Bad Request)} if the abc25 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc25 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-25-s/{id}")
    public ResponseEntity<Abc25> updateAbc25(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc25 abc25)
        throws URISyntaxException {
        log.debug("REST request to update Abc25 : {}, {}", id, abc25);
        if (abc25.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc25.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc25Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc25 result = abc25Repository.save(abc25);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc25.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-25-s/:id} : Partial updates given fields of an existing abc25, field will ignore if it is null
     *
     * @param id the id of the abc25 to save.
     * @param abc25 the abc25 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc25,
     * or with status {@code 400 (Bad Request)} if the abc25 is not valid,
     * or with status {@code 404 (Not Found)} if the abc25 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc25 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-25-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc25> partialUpdateAbc25(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc25 abc25
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc25 partially : {}, {}", id, abc25);
        if (abc25.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc25.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc25Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc25> result = abc25Repository
            .findById(abc25.getId())
            .map(existingAbc25 -> {
                if (abc25.getName() != null) {
                    existingAbc25.setName(abc25.getName());
                }
                if (abc25.getOtherField() != null) {
                    existingAbc25.setOtherField(abc25.getOtherField());
                }

                return existingAbc25;
            })
            .map(abc25Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc25.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-25-s} : get all the abc25s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc25s in body.
     */
    @GetMapping("/abc-25-s")
    public List<Abc25> getAllAbc25s() {
        log.debug("REST request to get all Abc25s");
        return abc25Repository.findAll();
    }

    /**
     * {@code GET  /abc-25-s/:id} : get the "id" abc25.
     *
     * @param id the id of the abc25 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc25, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-25-s/{id}")
    public ResponseEntity<Abc25> getAbc25(@PathVariable Long id) {
        log.debug("REST request to get Abc25 : {}", id);
        Optional<Abc25> abc25 = abc25Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc25);
    }

    /**
     * {@code DELETE  /abc-25-s/:id} : delete the "id" abc25.
     *
     * @param id the id of the abc25 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-25-s/{id}")
    public ResponseEntity<Void> deleteAbc25(@PathVariable Long id) {
        log.debug("REST request to delete Abc25 : {}", id);
        abc25Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
