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
import sample.domain.Abc7;
import sample.repository.Abc7Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc7}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc7Resource {

    private final Logger log = LoggerFactory.getLogger(Abc7Resource.class);

    private static final String ENTITY_NAME = "abc7";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc7Repository abc7Repository;

    public Abc7Resource(Abc7Repository abc7Repository) {
        this.abc7Repository = abc7Repository;
    }

    /**
     * {@code POST  /abc-7-s} : Create a new abc7.
     *
     * @param abc7 the abc7 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc7, or with status {@code 400 (Bad Request)} if the abc7 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-7-s")
    public ResponseEntity<Abc7> createAbc7(@Valid @RequestBody Abc7 abc7) throws URISyntaxException {
        log.debug("REST request to save Abc7 : {}", abc7);
        if (abc7.getId() != null) {
            throw new BadRequestAlertException("A new abc7 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc7 result = abc7Repository.save(abc7);
        return ResponseEntity
            .created(new URI("/api/abc-7-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-7-s/:id} : Updates an existing abc7.
     *
     * @param id the id of the abc7 to save.
     * @param abc7 the abc7 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc7,
     * or with status {@code 400 (Bad Request)} if the abc7 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc7 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-7-s/{id}")
    public ResponseEntity<Abc7> updateAbc7(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc7 abc7)
        throws URISyntaxException {
        log.debug("REST request to update Abc7 : {}, {}", id, abc7);
        if (abc7.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc7.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc7Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc7 result = abc7Repository.save(abc7);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc7.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-7-s/:id} : Partial updates given fields of an existing abc7, field will ignore if it is null
     *
     * @param id the id of the abc7 to save.
     * @param abc7 the abc7 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc7,
     * or with status {@code 400 (Bad Request)} if the abc7 is not valid,
     * or with status {@code 404 (Not Found)} if the abc7 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc7 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-7-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc7> partialUpdateAbc7(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc7 abc7
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc7 partially : {}, {}", id, abc7);
        if (abc7.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc7.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc7Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc7> result = abc7Repository
            .findById(abc7.getId())
            .map(existingAbc7 -> {
                if (abc7.getName() != null) {
                    existingAbc7.setName(abc7.getName());
                }
                if (abc7.getOtherField() != null) {
                    existingAbc7.setOtherField(abc7.getOtherField());
                }

                return existingAbc7;
            })
            .map(abc7Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc7.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-7-s} : get all the abc7s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc7s in body.
     */
    @GetMapping("/abc-7-s")
    public List<Abc7> getAllAbc7s() {
        log.debug("REST request to get all Abc7s");
        return abc7Repository.findAll();
    }

    /**
     * {@code GET  /abc-7-s/:id} : get the "id" abc7.
     *
     * @param id the id of the abc7 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc7, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-7-s/{id}")
    public ResponseEntity<Abc7> getAbc7(@PathVariable Long id) {
        log.debug("REST request to get Abc7 : {}", id);
        Optional<Abc7> abc7 = abc7Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc7);
    }

    /**
     * {@code DELETE  /abc-7-s/:id} : delete the "id" abc7.
     *
     * @param id the id of the abc7 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-7-s/{id}")
    public ResponseEntity<Void> deleteAbc7(@PathVariable Long id) {
        log.debug("REST request to delete Abc7 : {}", id);
        abc7Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
