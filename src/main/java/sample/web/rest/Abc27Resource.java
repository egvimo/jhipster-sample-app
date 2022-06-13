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
import sample.domain.Abc27;
import sample.repository.Abc27Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc27}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc27Resource {

    private final Logger log = LoggerFactory.getLogger(Abc27Resource.class);

    private static final String ENTITY_NAME = "abc27";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc27Repository abc27Repository;

    public Abc27Resource(Abc27Repository abc27Repository) {
        this.abc27Repository = abc27Repository;
    }

    /**
     * {@code POST  /abc-27-s} : Create a new abc27.
     *
     * @param abc27 the abc27 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc27, or with status {@code 400 (Bad Request)} if the abc27 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-27-s")
    public ResponseEntity<Abc27> createAbc27(@Valid @RequestBody Abc27 abc27) throws URISyntaxException {
        log.debug("REST request to save Abc27 : {}", abc27);
        if (abc27.getId() != null) {
            throw new BadRequestAlertException("A new abc27 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc27 result = abc27Repository.save(abc27);
        return ResponseEntity
            .created(new URI("/api/abc-27-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-27-s/:id} : Updates an existing abc27.
     *
     * @param id the id of the abc27 to save.
     * @param abc27 the abc27 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc27,
     * or with status {@code 400 (Bad Request)} if the abc27 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc27 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-27-s/{id}")
    public ResponseEntity<Abc27> updateAbc27(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc27 abc27)
        throws URISyntaxException {
        log.debug("REST request to update Abc27 : {}, {}", id, abc27);
        if (abc27.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc27.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc27Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc27 result = abc27Repository.save(abc27);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc27.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-27-s/:id} : Partial updates given fields of an existing abc27, field will ignore if it is null
     *
     * @param id the id of the abc27 to save.
     * @param abc27 the abc27 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc27,
     * or with status {@code 400 (Bad Request)} if the abc27 is not valid,
     * or with status {@code 404 (Not Found)} if the abc27 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc27 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-27-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc27> partialUpdateAbc27(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc27 abc27
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc27 partially : {}, {}", id, abc27);
        if (abc27.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc27.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc27Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc27> result = abc27Repository
            .findById(abc27.getId())
            .map(existingAbc27 -> {
                if (abc27.getName() != null) {
                    existingAbc27.setName(abc27.getName());
                }
                if (abc27.getOtherField() != null) {
                    existingAbc27.setOtherField(abc27.getOtherField());
                }

                return existingAbc27;
            })
            .map(abc27Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc27.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-27-s} : get all the abc27s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc27s in body.
     */
    @GetMapping("/abc-27-s")
    public List<Abc27> getAllAbc27s() {
        log.debug("REST request to get all Abc27s");
        return abc27Repository.findAll();
    }

    /**
     * {@code GET  /abc-27-s/:id} : get the "id" abc27.
     *
     * @param id the id of the abc27 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc27, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-27-s/{id}")
    public ResponseEntity<Abc27> getAbc27(@PathVariable Long id) {
        log.debug("REST request to get Abc27 : {}", id);
        Optional<Abc27> abc27 = abc27Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc27);
    }

    /**
     * {@code DELETE  /abc-27-s/:id} : delete the "id" abc27.
     *
     * @param id the id of the abc27 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-27-s/{id}")
    public ResponseEntity<Void> deleteAbc27(@PathVariable Long id) {
        log.debug("REST request to delete Abc27 : {}", id);
        abc27Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
