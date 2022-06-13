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
import sample.domain.Abc18;
import sample.repository.Abc18Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc18}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc18Resource {

    private final Logger log = LoggerFactory.getLogger(Abc18Resource.class);

    private static final String ENTITY_NAME = "abc18";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc18Repository abc18Repository;

    public Abc18Resource(Abc18Repository abc18Repository) {
        this.abc18Repository = abc18Repository;
    }

    /**
     * {@code POST  /abc-18-s} : Create a new abc18.
     *
     * @param abc18 the abc18 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc18, or with status {@code 400 (Bad Request)} if the abc18 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-18-s")
    public ResponseEntity<Abc18> createAbc18(@Valid @RequestBody Abc18 abc18) throws URISyntaxException {
        log.debug("REST request to save Abc18 : {}", abc18);
        if (abc18.getId() != null) {
            throw new BadRequestAlertException("A new abc18 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc18 result = abc18Repository.save(abc18);
        return ResponseEntity
            .created(new URI("/api/abc-18-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-18-s/:id} : Updates an existing abc18.
     *
     * @param id the id of the abc18 to save.
     * @param abc18 the abc18 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc18,
     * or with status {@code 400 (Bad Request)} if the abc18 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc18 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-18-s/{id}")
    public ResponseEntity<Abc18> updateAbc18(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc18 abc18)
        throws URISyntaxException {
        log.debug("REST request to update Abc18 : {}, {}", id, abc18);
        if (abc18.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc18.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc18Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc18 result = abc18Repository.save(abc18);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc18.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-18-s/:id} : Partial updates given fields of an existing abc18, field will ignore if it is null
     *
     * @param id the id of the abc18 to save.
     * @param abc18 the abc18 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc18,
     * or with status {@code 400 (Bad Request)} if the abc18 is not valid,
     * or with status {@code 404 (Not Found)} if the abc18 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc18 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-18-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc18> partialUpdateAbc18(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc18 abc18
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc18 partially : {}, {}", id, abc18);
        if (abc18.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc18.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc18Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc18> result = abc18Repository
            .findById(abc18.getId())
            .map(existingAbc18 -> {
                if (abc18.getName() != null) {
                    existingAbc18.setName(abc18.getName());
                }
                if (abc18.getOtherField() != null) {
                    existingAbc18.setOtherField(abc18.getOtherField());
                }

                return existingAbc18;
            })
            .map(abc18Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc18.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-18-s} : get all the abc18s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc18s in body.
     */
    @GetMapping("/abc-18-s")
    public List<Abc18> getAllAbc18s() {
        log.debug("REST request to get all Abc18s");
        return abc18Repository.findAll();
    }

    /**
     * {@code GET  /abc-18-s/:id} : get the "id" abc18.
     *
     * @param id the id of the abc18 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc18, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-18-s/{id}")
    public ResponseEntity<Abc18> getAbc18(@PathVariable Long id) {
        log.debug("REST request to get Abc18 : {}", id);
        Optional<Abc18> abc18 = abc18Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc18);
    }

    /**
     * {@code DELETE  /abc-18-s/:id} : delete the "id" abc18.
     *
     * @param id the id of the abc18 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-18-s/{id}")
    public ResponseEntity<Void> deleteAbc18(@PathVariable Long id) {
        log.debug("REST request to delete Abc18 : {}", id);
        abc18Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
