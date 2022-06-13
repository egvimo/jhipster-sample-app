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
import sample.domain.Abc8;
import sample.repository.Abc8Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc8}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc8Resource {

    private final Logger log = LoggerFactory.getLogger(Abc8Resource.class);

    private static final String ENTITY_NAME = "abc8";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc8Repository abc8Repository;

    public Abc8Resource(Abc8Repository abc8Repository) {
        this.abc8Repository = abc8Repository;
    }

    /**
     * {@code POST  /abc-8-s} : Create a new abc8.
     *
     * @param abc8 the abc8 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc8, or with status {@code 400 (Bad Request)} if the abc8 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-8-s")
    public ResponseEntity<Abc8> createAbc8(@Valid @RequestBody Abc8 abc8) throws URISyntaxException {
        log.debug("REST request to save Abc8 : {}", abc8);
        if (abc8.getId() != null) {
            throw new BadRequestAlertException("A new abc8 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc8 result = abc8Repository.save(abc8);
        return ResponseEntity
            .created(new URI("/api/abc-8-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-8-s/:id} : Updates an existing abc8.
     *
     * @param id the id of the abc8 to save.
     * @param abc8 the abc8 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc8,
     * or with status {@code 400 (Bad Request)} if the abc8 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc8 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-8-s/{id}")
    public ResponseEntity<Abc8> updateAbc8(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc8 abc8)
        throws URISyntaxException {
        log.debug("REST request to update Abc8 : {}, {}", id, abc8);
        if (abc8.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc8.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc8Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc8 result = abc8Repository.save(abc8);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc8.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-8-s/:id} : Partial updates given fields of an existing abc8, field will ignore if it is null
     *
     * @param id the id of the abc8 to save.
     * @param abc8 the abc8 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc8,
     * or with status {@code 400 (Bad Request)} if the abc8 is not valid,
     * or with status {@code 404 (Not Found)} if the abc8 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc8 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-8-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc8> partialUpdateAbc8(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc8 abc8
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc8 partially : {}, {}", id, abc8);
        if (abc8.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc8.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc8Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc8> result = abc8Repository
            .findById(abc8.getId())
            .map(existingAbc8 -> {
                if (abc8.getName() != null) {
                    existingAbc8.setName(abc8.getName());
                }
                if (abc8.getOtherField() != null) {
                    existingAbc8.setOtherField(abc8.getOtherField());
                }

                return existingAbc8;
            })
            .map(abc8Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc8.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-8-s} : get all the abc8s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc8s in body.
     */
    @GetMapping("/abc-8-s")
    public List<Abc8> getAllAbc8s() {
        log.debug("REST request to get all Abc8s");
        return abc8Repository.findAll();
    }

    /**
     * {@code GET  /abc-8-s/:id} : get the "id" abc8.
     *
     * @param id the id of the abc8 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc8, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-8-s/{id}")
    public ResponseEntity<Abc8> getAbc8(@PathVariable Long id) {
        log.debug("REST request to get Abc8 : {}", id);
        Optional<Abc8> abc8 = abc8Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc8);
    }

    /**
     * {@code DELETE  /abc-8-s/:id} : delete the "id" abc8.
     *
     * @param id the id of the abc8 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-8-s/{id}")
    public ResponseEntity<Void> deleteAbc8(@PathVariable Long id) {
        log.debug("REST request to delete Abc8 : {}", id);
        abc8Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
