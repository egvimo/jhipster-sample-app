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
import sample.domain.Abc9;
import sample.repository.Abc9Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc9}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc9Resource {

    private final Logger log = LoggerFactory.getLogger(Abc9Resource.class);

    private static final String ENTITY_NAME = "abc9";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc9Repository abc9Repository;

    public Abc9Resource(Abc9Repository abc9Repository) {
        this.abc9Repository = abc9Repository;
    }

    /**
     * {@code POST  /abc-9-s} : Create a new abc9.
     *
     * @param abc9 the abc9 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc9, or with status {@code 400 (Bad Request)} if the abc9 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-9-s")
    public ResponseEntity<Abc9> createAbc9(@Valid @RequestBody Abc9 abc9) throws URISyntaxException {
        log.debug("REST request to save Abc9 : {}", abc9);
        if (abc9.getId() != null) {
            throw new BadRequestAlertException("A new abc9 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc9 result = abc9Repository.save(abc9);
        return ResponseEntity
            .created(new URI("/api/abc-9-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-9-s/:id} : Updates an existing abc9.
     *
     * @param id the id of the abc9 to save.
     * @param abc9 the abc9 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc9,
     * or with status {@code 400 (Bad Request)} if the abc9 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc9 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-9-s/{id}")
    public ResponseEntity<Abc9> updateAbc9(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc9 abc9)
        throws URISyntaxException {
        log.debug("REST request to update Abc9 : {}, {}", id, abc9);
        if (abc9.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc9.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc9Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc9 result = abc9Repository.save(abc9);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc9.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-9-s/:id} : Partial updates given fields of an existing abc9, field will ignore if it is null
     *
     * @param id the id of the abc9 to save.
     * @param abc9 the abc9 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc9,
     * or with status {@code 400 (Bad Request)} if the abc9 is not valid,
     * or with status {@code 404 (Not Found)} if the abc9 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc9 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-9-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc9> partialUpdateAbc9(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc9 abc9
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc9 partially : {}, {}", id, abc9);
        if (abc9.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc9.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc9Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc9> result = abc9Repository
            .findById(abc9.getId())
            .map(existingAbc9 -> {
                if (abc9.getName() != null) {
                    existingAbc9.setName(abc9.getName());
                }
                if (abc9.getOtherField() != null) {
                    existingAbc9.setOtherField(abc9.getOtherField());
                }

                return existingAbc9;
            })
            .map(abc9Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc9.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-9-s} : get all the abc9s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc9s in body.
     */
    @GetMapping("/abc-9-s")
    public List<Abc9> getAllAbc9s() {
        log.debug("REST request to get all Abc9s");
        return abc9Repository.findAll();
    }

    /**
     * {@code GET  /abc-9-s/:id} : get the "id" abc9.
     *
     * @param id the id of the abc9 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc9, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-9-s/{id}")
    public ResponseEntity<Abc9> getAbc9(@PathVariable Long id) {
        log.debug("REST request to get Abc9 : {}", id);
        Optional<Abc9> abc9 = abc9Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc9);
    }

    /**
     * {@code DELETE  /abc-9-s/:id} : delete the "id" abc9.
     *
     * @param id the id of the abc9 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-9-s/{id}")
    public ResponseEntity<Void> deleteAbc9(@PathVariable Long id) {
        log.debug("REST request to delete Abc9 : {}", id);
        abc9Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
