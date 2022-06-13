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
import sample.domain.Abc3;
import sample.repository.Abc3Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc3}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc3Resource {

    private final Logger log = LoggerFactory.getLogger(Abc3Resource.class);

    private static final String ENTITY_NAME = "abc3";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc3Repository abc3Repository;

    public Abc3Resource(Abc3Repository abc3Repository) {
        this.abc3Repository = abc3Repository;
    }

    /**
     * {@code POST  /abc-3-s} : Create a new abc3.
     *
     * @param abc3 the abc3 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc3, or with status {@code 400 (Bad Request)} if the abc3 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-3-s")
    public ResponseEntity<Abc3> createAbc3(@Valid @RequestBody Abc3 abc3) throws URISyntaxException {
        log.debug("REST request to save Abc3 : {}", abc3);
        if (abc3.getId() != null) {
            throw new BadRequestAlertException("A new abc3 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc3 result = abc3Repository.save(abc3);
        return ResponseEntity
            .created(new URI("/api/abc-3-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-3-s/:id} : Updates an existing abc3.
     *
     * @param id the id of the abc3 to save.
     * @param abc3 the abc3 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc3,
     * or with status {@code 400 (Bad Request)} if the abc3 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc3 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-3-s/{id}")
    public ResponseEntity<Abc3> updateAbc3(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc3 abc3)
        throws URISyntaxException {
        log.debug("REST request to update Abc3 : {}, {}", id, abc3);
        if (abc3.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc3.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc3Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc3 result = abc3Repository.save(abc3);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc3.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-3-s/:id} : Partial updates given fields of an existing abc3, field will ignore if it is null
     *
     * @param id the id of the abc3 to save.
     * @param abc3 the abc3 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc3,
     * or with status {@code 400 (Bad Request)} if the abc3 is not valid,
     * or with status {@code 404 (Not Found)} if the abc3 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc3 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-3-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc3> partialUpdateAbc3(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc3 abc3
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc3 partially : {}, {}", id, abc3);
        if (abc3.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc3.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc3Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc3> result = abc3Repository
            .findById(abc3.getId())
            .map(existingAbc3 -> {
                if (abc3.getName() != null) {
                    existingAbc3.setName(abc3.getName());
                }
                if (abc3.getOtherField() != null) {
                    existingAbc3.setOtherField(abc3.getOtherField());
                }

                return existingAbc3;
            })
            .map(abc3Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc3.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-3-s} : get all the abc3s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc3s in body.
     */
    @GetMapping("/abc-3-s")
    public List<Abc3> getAllAbc3s() {
        log.debug("REST request to get all Abc3s");
        return abc3Repository.findAll();
    }

    /**
     * {@code GET  /abc-3-s/:id} : get the "id" abc3.
     *
     * @param id the id of the abc3 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc3, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-3-s/{id}")
    public ResponseEntity<Abc3> getAbc3(@PathVariable Long id) {
        log.debug("REST request to get Abc3 : {}", id);
        Optional<Abc3> abc3 = abc3Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc3);
    }

    /**
     * {@code DELETE  /abc-3-s/:id} : delete the "id" abc3.
     *
     * @param id the id of the abc3 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-3-s/{id}")
    public ResponseEntity<Void> deleteAbc3(@PathVariable Long id) {
        log.debug("REST request to delete Abc3 : {}", id);
        abc3Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
