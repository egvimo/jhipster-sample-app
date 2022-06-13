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
import sample.domain.Abc21;
import sample.repository.Abc21Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc21}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc21Resource {

    private final Logger log = LoggerFactory.getLogger(Abc21Resource.class);

    private static final String ENTITY_NAME = "abc21";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc21Repository abc21Repository;

    public Abc21Resource(Abc21Repository abc21Repository) {
        this.abc21Repository = abc21Repository;
    }

    /**
     * {@code POST  /abc-21-s} : Create a new abc21.
     *
     * @param abc21 the abc21 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc21, or with status {@code 400 (Bad Request)} if the abc21 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-21-s")
    public ResponseEntity<Abc21> createAbc21(@Valid @RequestBody Abc21 abc21) throws URISyntaxException {
        log.debug("REST request to save Abc21 : {}", abc21);
        if (abc21.getId() != null) {
            throw new BadRequestAlertException("A new abc21 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc21 result = abc21Repository.save(abc21);
        return ResponseEntity
            .created(new URI("/api/abc-21-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-21-s/:id} : Updates an existing abc21.
     *
     * @param id the id of the abc21 to save.
     * @param abc21 the abc21 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc21,
     * or with status {@code 400 (Bad Request)} if the abc21 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc21 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-21-s/{id}")
    public ResponseEntity<Abc21> updateAbc21(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc21 abc21)
        throws URISyntaxException {
        log.debug("REST request to update Abc21 : {}, {}", id, abc21);
        if (abc21.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc21.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc21Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc21 result = abc21Repository.save(abc21);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc21.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-21-s/:id} : Partial updates given fields of an existing abc21, field will ignore if it is null
     *
     * @param id the id of the abc21 to save.
     * @param abc21 the abc21 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc21,
     * or with status {@code 400 (Bad Request)} if the abc21 is not valid,
     * or with status {@code 404 (Not Found)} if the abc21 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc21 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-21-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc21> partialUpdateAbc21(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc21 abc21
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc21 partially : {}, {}", id, abc21);
        if (abc21.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc21.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc21Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc21> result = abc21Repository
            .findById(abc21.getId())
            .map(existingAbc21 -> {
                if (abc21.getName() != null) {
                    existingAbc21.setName(abc21.getName());
                }
                if (abc21.getOtherField() != null) {
                    existingAbc21.setOtherField(abc21.getOtherField());
                }

                return existingAbc21;
            })
            .map(abc21Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc21.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-21-s} : get all the abc21s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc21s in body.
     */
    @GetMapping("/abc-21-s")
    public List<Abc21> getAllAbc21s() {
        log.debug("REST request to get all Abc21s");
        return abc21Repository.findAll();
    }

    /**
     * {@code GET  /abc-21-s/:id} : get the "id" abc21.
     *
     * @param id the id of the abc21 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc21, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-21-s/{id}")
    public ResponseEntity<Abc21> getAbc21(@PathVariable Long id) {
        log.debug("REST request to get Abc21 : {}", id);
        Optional<Abc21> abc21 = abc21Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc21);
    }

    /**
     * {@code DELETE  /abc-21-s/:id} : delete the "id" abc21.
     *
     * @param id the id of the abc21 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-21-s/{id}")
    public ResponseEntity<Void> deleteAbc21(@PathVariable Long id) {
        log.debug("REST request to delete Abc21 : {}", id);
        abc21Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
