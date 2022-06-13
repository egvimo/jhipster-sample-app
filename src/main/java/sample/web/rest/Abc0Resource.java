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
import sample.domain.Abc0;
import sample.repository.Abc0Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc0}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc0Resource {

    private final Logger log = LoggerFactory.getLogger(Abc0Resource.class);

    private static final String ENTITY_NAME = "abc0";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc0Repository abc0Repository;

    public Abc0Resource(Abc0Repository abc0Repository) {
        this.abc0Repository = abc0Repository;
    }

    /**
     * {@code POST  /abc-0-s} : Create a new abc0.
     *
     * @param abc0 the abc0 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc0, or with status {@code 400 (Bad Request)} if the abc0 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-0-s")
    public ResponseEntity<Abc0> createAbc0(@Valid @RequestBody Abc0 abc0) throws URISyntaxException {
        log.debug("REST request to save Abc0 : {}", abc0);
        if (abc0.getId() != null) {
            throw new BadRequestAlertException("A new abc0 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc0 result = abc0Repository.save(abc0);
        return ResponseEntity
            .created(new URI("/api/abc-0-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-0-s/:id} : Updates an existing abc0.
     *
     * @param id the id of the abc0 to save.
     * @param abc0 the abc0 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc0,
     * or with status {@code 400 (Bad Request)} if the abc0 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc0 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-0-s/{id}")
    public ResponseEntity<Abc0> updateAbc0(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc0 abc0)
        throws URISyntaxException {
        log.debug("REST request to update Abc0 : {}, {}", id, abc0);
        if (abc0.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc0.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc0Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc0 result = abc0Repository.save(abc0);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc0.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-0-s/:id} : Partial updates given fields of an existing abc0, field will ignore if it is null
     *
     * @param id the id of the abc0 to save.
     * @param abc0 the abc0 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc0,
     * or with status {@code 400 (Bad Request)} if the abc0 is not valid,
     * or with status {@code 404 (Not Found)} if the abc0 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc0 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-0-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc0> partialUpdateAbc0(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc0 abc0
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc0 partially : {}, {}", id, abc0);
        if (abc0.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc0.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc0Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc0> result = abc0Repository
            .findById(abc0.getId())
            .map(existingAbc0 -> {
                if (abc0.getName() != null) {
                    existingAbc0.setName(abc0.getName());
                }
                if (abc0.getOtherField() != null) {
                    existingAbc0.setOtherField(abc0.getOtherField());
                }

                return existingAbc0;
            })
            .map(abc0Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc0.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-0-s} : get all the abc0s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc0s in body.
     */
    @GetMapping("/abc-0-s")
    public List<Abc0> getAllAbc0s() {
        log.debug("REST request to get all Abc0s");
        return abc0Repository.findAll();
    }

    /**
     * {@code GET  /abc-0-s/:id} : get the "id" abc0.
     *
     * @param id the id of the abc0 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc0, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-0-s/{id}")
    public ResponseEntity<Abc0> getAbc0(@PathVariable Long id) {
        log.debug("REST request to get Abc0 : {}", id);
        Optional<Abc0> abc0 = abc0Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc0);
    }

    /**
     * {@code DELETE  /abc-0-s/:id} : delete the "id" abc0.
     *
     * @param id the id of the abc0 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-0-s/{id}")
    public ResponseEntity<Void> deleteAbc0(@PathVariable Long id) {
        log.debug("REST request to delete Abc0 : {}", id);
        abc0Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
