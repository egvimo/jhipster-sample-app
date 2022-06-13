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
import sample.domain.Abc23;
import sample.repository.Abc23Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc23}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc23Resource {

    private final Logger log = LoggerFactory.getLogger(Abc23Resource.class);

    private static final String ENTITY_NAME = "abc23";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc23Repository abc23Repository;

    public Abc23Resource(Abc23Repository abc23Repository) {
        this.abc23Repository = abc23Repository;
    }

    /**
     * {@code POST  /abc-23-s} : Create a new abc23.
     *
     * @param abc23 the abc23 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc23, or with status {@code 400 (Bad Request)} if the abc23 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-23-s")
    public ResponseEntity<Abc23> createAbc23(@Valid @RequestBody Abc23 abc23) throws URISyntaxException {
        log.debug("REST request to save Abc23 : {}", abc23);
        if (abc23.getId() != null) {
            throw new BadRequestAlertException("A new abc23 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc23 result = abc23Repository.save(abc23);
        return ResponseEntity
            .created(new URI("/api/abc-23-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-23-s/:id} : Updates an existing abc23.
     *
     * @param id the id of the abc23 to save.
     * @param abc23 the abc23 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc23,
     * or with status {@code 400 (Bad Request)} if the abc23 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc23 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-23-s/{id}")
    public ResponseEntity<Abc23> updateAbc23(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc23 abc23)
        throws URISyntaxException {
        log.debug("REST request to update Abc23 : {}, {}", id, abc23);
        if (abc23.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc23.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc23Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc23 result = abc23Repository.save(abc23);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc23.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-23-s/:id} : Partial updates given fields of an existing abc23, field will ignore if it is null
     *
     * @param id the id of the abc23 to save.
     * @param abc23 the abc23 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc23,
     * or with status {@code 400 (Bad Request)} if the abc23 is not valid,
     * or with status {@code 404 (Not Found)} if the abc23 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc23 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-23-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc23> partialUpdateAbc23(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc23 abc23
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc23 partially : {}, {}", id, abc23);
        if (abc23.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc23.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc23Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc23> result = abc23Repository
            .findById(abc23.getId())
            .map(existingAbc23 -> {
                if (abc23.getName() != null) {
                    existingAbc23.setName(abc23.getName());
                }
                if (abc23.getOtherField() != null) {
                    existingAbc23.setOtherField(abc23.getOtherField());
                }

                return existingAbc23;
            })
            .map(abc23Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc23.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-23-s} : get all the abc23s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc23s in body.
     */
    @GetMapping("/abc-23-s")
    public List<Abc23> getAllAbc23s() {
        log.debug("REST request to get all Abc23s");
        return abc23Repository.findAll();
    }

    /**
     * {@code GET  /abc-23-s/:id} : get the "id" abc23.
     *
     * @param id the id of the abc23 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc23, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-23-s/{id}")
    public ResponseEntity<Abc23> getAbc23(@PathVariable Long id) {
        log.debug("REST request to get Abc23 : {}", id);
        Optional<Abc23> abc23 = abc23Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc23);
    }

    /**
     * {@code DELETE  /abc-23-s/:id} : delete the "id" abc23.
     *
     * @param id the id of the abc23 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-23-s/{id}")
    public ResponseEntity<Void> deleteAbc23(@PathVariable Long id) {
        log.debug("REST request to delete Abc23 : {}", id);
        abc23Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
