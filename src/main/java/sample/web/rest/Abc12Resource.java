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
import sample.domain.Abc12;
import sample.repository.Abc12Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc12}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc12Resource {

    private final Logger log = LoggerFactory.getLogger(Abc12Resource.class);

    private static final String ENTITY_NAME = "abc12";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc12Repository abc12Repository;

    public Abc12Resource(Abc12Repository abc12Repository) {
        this.abc12Repository = abc12Repository;
    }

    /**
     * {@code POST  /abc-12-s} : Create a new abc12.
     *
     * @param abc12 the abc12 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc12, or with status {@code 400 (Bad Request)} if the abc12 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-12-s")
    public ResponseEntity<Abc12> createAbc12(@Valid @RequestBody Abc12 abc12) throws URISyntaxException {
        log.debug("REST request to save Abc12 : {}", abc12);
        if (abc12.getId() != null) {
            throw new BadRequestAlertException("A new abc12 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc12 result = abc12Repository.save(abc12);
        return ResponseEntity
            .created(new URI("/api/abc-12-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-12-s/:id} : Updates an existing abc12.
     *
     * @param id the id of the abc12 to save.
     * @param abc12 the abc12 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc12,
     * or with status {@code 400 (Bad Request)} if the abc12 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc12 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-12-s/{id}")
    public ResponseEntity<Abc12> updateAbc12(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc12 abc12)
        throws URISyntaxException {
        log.debug("REST request to update Abc12 : {}, {}", id, abc12);
        if (abc12.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc12.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc12Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc12 result = abc12Repository.save(abc12);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc12.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-12-s/:id} : Partial updates given fields of an existing abc12, field will ignore if it is null
     *
     * @param id the id of the abc12 to save.
     * @param abc12 the abc12 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc12,
     * or with status {@code 400 (Bad Request)} if the abc12 is not valid,
     * or with status {@code 404 (Not Found)} if the abc12 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc12 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-12-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc12> partialUpdateAbc12(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc12 abc12
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc12 partially : {}, {}", id, abc12);
        if (abc12.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc12.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc12Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc12> result = abc12Repository
            .findById(abc12.getId())
            .map(existingAbc12 -> {
                if (abc12.getName() != null) {
                    existingAbc12.setName(abc12.getName());
                }
                if (abc12.getOtherField() != null) {
                    existingAbc12.setOtherField(abc12.getOtherField());
                }

                return existingAbc12;
            })
            .map(abc12Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc12.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-12-s} : get all the abc12s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc12s in body.
     */
    @GetMapping("/abc-12-s")
    public List<Abc12> getAllAbc12s() {
        log.debug("REST request to get all Abc12s");
        return abc12Repository.findAll();
    }

    /**
     * {@code GET  /abc-12-s/:id} : get the "id" abc12.
     *
     * @param id the id of the abc12 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc12, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-12-s/{id}")
    public ResponseEntity<Abc12> getAbc12(@PathVariable Long id) {
        log.debug("REST request to get Abc12 : {}", id);
        Optional<Abc12> abc12 = abc12Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc12);
    }

    /**
     * {@code DELETE  /abc-12-s/:id} : delete the "id" abc12.
     *
     * @param id the id of the abc12 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-12-s/{id}")
    public ResponseEntity<Void> deleteAbc12(@PathVariable Long id) {
        log.debug("REST request to delete Abc12 : {}", id);
        abc12Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
