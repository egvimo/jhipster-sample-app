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
import sample.domain.Abc29;
import sample.repository.Abc29Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc29}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc29Resource {

    private final Logger log = LoggerFactory.getLogger(Abc29Resource.class);

    private static final String ENTITY_NAME = "abc29";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc29Repository abc29Repository;

    public Abc29Resource(Abc29Repository abc29Repository) {
        this.abc29Repository = abc29Repository;
    }

    /**
     * {@code POST  /abc-29-s} : Create a new abc29.
     *
     * @param abc29 the abc29 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc29, or with status {@code 400 (Bad Request)} if the abc29 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-29-s")
    public ResponseEntity<Abc29> createAbc29(@Valid @RequestBody Abc29 abc29) throws URISyntaxException {
        log.debug("REST request to save Abc29 : {}", abc29);
        if (abc29.getId() != null) {
            throw new BadRequestAlertException("A new abc29 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc29 result = abc29Repository.save(abc29);
        return ResponseEntity
            .created(new URI("/api/abc-29-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-29-s/:id} : Updates an existing abc29.
     *
     * @param id the id of the abc29 to save.
     * @param abc29 the abc29 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc29,
     * or with status {@code 400 (Bad Request)} if the abc29 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc29 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-29-s/{id}")
    public ResponseEntity<Abc29> updateAbc29(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc29 abc29)
        throws URISyntaxException {
        log.debug("REST request to update Abc29 : {}, {}", id, abc29);
        if (abc29.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc29.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc29Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc29 result = abc29Repository.save(abc29);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc29.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-29-s/:id} : Partial updates given fields of an existing abc29, field will ignore if it is null
     *
     * @param id the id of the abc29 to save.
     * @param abc29 the abc29 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc29,
     * or with status {@code 400 (Bad Request)} if the abc29 is not valid,
     * or with status {@code 404 (Not Found)} if the abc29 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc29 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-29-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc29> partialUpdateAbc29(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc29 abc29
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc29 partially : {}, {}", id, abc29);
        if (abc29.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc29.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc29Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc29> result = abc29Repository
            .findById(abc29.getId())
            .map(existingAbc29 -> {
                if (abc29.getName() != null) {
                    existingAbc29.setName(abc29.getName());
                }
                if (abc29.getOtherField() != null) {
                    existingAbc29.setOtherField(abc29.getOtherField());
                }

                return existingAbc29;
            })
            .map(abc29Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc29.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-29-s} : get all the abc29s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc29s in body.
     */
    @GetMapping("/abc-29-s")
    public List<Abc29> getAllAbc29s() {
        log.debug("REST request to get all Abc29s");
        return abc29Repository.findAll();
    }

    /**
     * {@code GET  /abc-29-s/:id} : get the "id" abc29.
     *
     * @param id the id of the abc29 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc29, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-29-s/{id}")
    public ResponseEntity<Abc29> getAbc29(@PathVariable Long id) {
        log.debug("REST request to get Abc29 : {}", id);
        Optional<Abc29> abc29 = abc29Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc29);
    }

    /**
     * {@code DELETE  /abc-29-s/:id} : delete the "id" abc29.
     *
     * @param id the id of the abc29 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-29-s/{id}")
    public ResponseEntity<Void> deleteAbc29(@PathVariable Long id) {
        log.debug("REST request to delete Abc29 : {}", id);
        abc29Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
