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
import sample.domain.Abc28;
import sample.repository.Abc28Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc28}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc28Resource {

    private final Logger log = LoggerFactory.getLogger(Abc28Resource.class);

    private static final String ENTITY_NAME = "abc28";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc28Repository abc28Repository;

    public Abc28Resource(Abc28Repository abc28Repository) {
        this.abc28Repository = abc28Repository;
    }

    /**
     * {@code POST  /abc-28-s} : Create a new abc28.
     *
     * @param abc28 the abc28 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc28, or with status {@code 400 (Bad Request)} if the abc28 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-28-s")
    public ResponseEntity<Abc28> createAbc28(@Valid @RequestBody Abc28 abc28) throws URISyntaxException {
        log.debug("REST request to save Abc28 : {}", abc28);
        if (abc28.getId() != null) {
            throw new BadRequestAlertException("A new abc28 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc28 result = abc28Repository.save(abc28);
        return ResponseEntity
            .created(new URI("/api/abc-28-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-28-s/:id} : Updates an existing abc28.
     *
     * @param id the id of the abc28 to save.
     * @param abc28 the abc28 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc28,
     * or with status {@code 400 (Bad Request)} if the abc28 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc28 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-28-s/{id}")
    public ResponseEntity<Abc28> updateAbc28(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc28 abc28)
        throws URISyntaxException {
        log.debug("REST request to update Abc28 : {}, {}", id, abc28);
        if (abc28.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc28.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc28Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc28 result = abc28Repository.save(abc28);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc28.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-28-s/:id} : Partial updates given fields of an existing abc28, field will ignore if it is null
     *
     * @param id the id of the abc28 to save.
     * @param abc28 the abc28 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc28,
     * or with status {@code 400 (Bad Request)} if the abc28 is not valid,
     * or with status {@code 404 (Not Found)} if the abc28 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc28 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-28-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc28> partialUpdateAbc28(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc28 abc28
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc28 partially : {}, {}", id, abc28);
        if (abc28.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc28.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc28Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc28> result = abc28Repository
            .findById(abc28.getId())
            .map(existingAbc28 -> {
                if (abc28.getName() != null) {
                    existingAbc28.setName(abc28.getName());
                }
                if (abc28.getOtherField() != null) {
                    existingAbc28.setOtherField(abc28.getOtherField());
                }

                return existingAbc28;
            })
            .map(abc28Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc28.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-28-s} : get all the abc28s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc28s in body.
     */
    @GetMapping("/abc-28-s")
    public List<Abc28> getAllAbc28s() {
        log.debug("REST request to get all Abc28s");
        return abc28Repository.findAll();
    }

    /**
     * {@code GET  /abc-28-s/:id} : get the "id" abc28.
     *
     * @param id the id of the abc28 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc28, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-28-s/{id}")
    public ResponseEntity<Abc28> getAbc28(@PathVariable Long id) {
        log.debug("REST request to get Abc28 : {}", id);
        Optional<Abc28> abc28 = abc28Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc28);
    }

    /**
     * {@code DELETE  /abc-28-s/:id} : delete the "id" abc28.
     *
     * @param id the id of the abc28 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-28-s/{id}")
    public ResponseEntity<Void> deleteAbc28(@PathVariable Long id) {
        log.debug("REST request to delete Abc28 : {}", id);
        abc28Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
