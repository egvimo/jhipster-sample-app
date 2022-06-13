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
import sample.domain.Abc13;
import sample.repository.Abc13Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc13}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc13Resource {

    private final Logger log = LoggerFactory.getLogger(Abc13Resource.class);

    private static final String ENTITY_NAME = "abc13";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc13Repository abc13Repository;

    public Abc13Resource(Abc13Repository abc13Repository) {
        this.abc13Repository = abc13Repository;
    }

    /**
     * {@code POST  /abc-13-s} : Create a new abc13.
     *
     * @param abc13 the abc13 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc13, or with status {@code 400 (Bad Request)} if the abc13 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-13-s")
    public ResponseEntity<Abc13> createAbc13(@Valid @RequestBody Abc13 abc13) throws URISyntaxException {
        log.debug("REST request to save Abc13 : {}", abc13);
        if (abc13.getId() != null) {
            throw new BadRequestAlertException("A new abc13 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc13 result = abc13Repository.save(abc13);
        return ResponseEntity
            .created(new URI("/api/abc-13-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-13-s/:id} : Updates an existing abc13.
     *
     * @param id the id of the abc13 to save.
     * @param abc13 the abc13 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc13,
     * or with status {@code 400 (Bad Request)} if the abc13 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc13 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-13-s/{id}")
    public ResponseEntity<Abc13> updateAbc13(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc13 abc13)
        throws URISyntaxException {
        log.debug("REST request to update Abc13 : {}, {}", id, abc13);
        if (abc13.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc13.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc13Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc13 result = abc13Repository.save(abc13);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc13.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-13-s/:id} : Partial updates given fields of an existing abc13, field will ignore if it is null
     *
     * @param id the id of the abc13 to save.
     * @param abc13 the abc13 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc13,
     * or with status {@code 400 (Bad Request)} if the abc13 is not valid,
     * or with status {@code 404 (Not Found)} if the abc13 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc13 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-13-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc13> partialUpdateAbc13(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc13 abc13
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc13 partially : {}, {}", id, abc13);
        if (abc13.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc13.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc13Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc13> result = abc13Repository
            .findById(abc13.getId())
            .map(existingAbc13 -> {
                if (abc13.getName() != null) {
                    existingAbc13.setName(abc13.getName());
                }
                if (abc13.getOtherField() != null) {
                    existingAbc13.setOtherField(abc13.getOtherField());
                }

                return existingAbc13;
            })
            .map(abc13Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc13.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-13-s} : get all the abc13s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc13s in body.
     */
    @GetMapping("/abc-13-s")
    public List<Abc13> getAllAbc13s() {
        log.debug("REST request to get all Abc13s");
        return abc13Repository.findAll();
    }

    /**
     * {@code GET  /abc-13-s/:id} : get the "id" abc13.
     *
     * @param id the id of the abc13 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc13, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-13-s/{id}")
    public ResponseEntity<Abc13> getAbc13(@PathVariable Long id) {
        log.debug("REST request to get Abc13 : {}", id);
        Optional<Abc13> abc13 = abc13Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc13);
    }

    /**
     * {@code DELETE  /abc-13-s/:id} : delete the "id" abc13.
     *
     * @param id the id of the abc13 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-13-s/{id}")
    public ResponseEntity<Void> deleteAbc13(@PathVariable Long id) {
        log.debug("REST request to delete Abc13 : {}", id);
        abc13Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
