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
import sample.domain.Abc16;
import sample.repository.Abc16Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc16}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc16Resource {

    private final Logger log = LoggerFactory.getLogger(Abc16Resource.class);

    private static final String ENTITY_NAME = "abc16";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc16Repository abc16Repository;

    public Abc16Resource(Abc16Repository abc16Repository) {
        this.abc16Repository = abc16Repository;
    }

    /**
     * {@code POST  /abc-16-s} : Create a new abc16.
     *
     * @param abc16 the abc16 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc16, or with status {@code 400 (Bad Request)} if the abc16 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-16-s")
    public ResponseEntity<Abc16> createAbc16(@Valid @RequestBody Abc16 abc16) throws URISyntaxException {
        log.debug("REST request to save Abc16 : {}", abc16);
        if (abc16.getId() != null) {
            throw new BadRequestAlertException("A new abc16 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc16 result = abc16Repository.save(abc16);
        return ResponseEntity
            .created(new URI("/api/abc-16-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-16-s/:id} : Updates an existing abc16.
     *
     * @param id the id of the abc16 to save.
     * @param abc16 the abc16 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc16,
     * or with status {@code 400 (Bad Request)} if the abc16 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc16 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-16-s/{id}")
    public ResponseEntity<Abc16> updateAbc16(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc16 abc16)
        throws URISyntaxException {
        log.debug("REST request to update Abc16 : {}, {}", id, abc16);
        if (abc16.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc16.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc16Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc16 result = abc16Repository.save(abc16);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc16.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-16-s/:id} : Partial updates given fields of an existing abc16, field will ignore if it is null
     *
     * @param id the id of the abc16 to save.
     * @param abc16 the abc16 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc16,
     * or with status {@code 400 (Bad Request)} if the abc16 is not valid,
     * or with status {@code 404 (Not Found)} if the abc16 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc16 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-16-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc16> partialUpdateAbc16(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc16 abc16
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc16 partially : {}, {}", id, abc16);
        if (abc16.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc16.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc16Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc16> result = abc16Repository
            .findById(abc16.getId())
            .map(existingAbc16 -> {
                if (abc16.getName() != null) {
                    existingAbc16.setName(abc16.getName());
                }
                if (abc16.getOtherField() != null) {
                    existingAbc16.setOtherField(abc16.getOtherField());
                }

                return existingAbc16;
            })
            .map(abc16Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc16.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-16-s} : get all the abc16s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc16s in body.
     */
    @GetMapping("/abc-16-s")
    public List<Abc16> getAllAbc16s() {
        log.debug("REST request to get all Abc16s");
        return abc16Repository.findAll();
    }

    /**
     * {@code GET  /abc-16-s/:id} : get the "id" abc16.
     *
     * @param id the id of the abc16 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc16, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-16-s/{id}")
    public ResponseEntity<Abc16> getAbc16(@PathVariable Long id) {
        log.debug("REST request to get Abc16 : {}", id);
        Optional<Abc16> abc16 = abc16Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc16);
    }

    /**
     * {@code DELETE  /abc-16-s/:id} : delete the "id" abc16.
     *
     * @param id the id of the abc16 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-16-s/{id}")
    public ResponseEntity<Void> deleteAbc16(@PathVariable Long id) {
        log.debug("REST request to delete Abc16 : {}", id);
        abc16Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
