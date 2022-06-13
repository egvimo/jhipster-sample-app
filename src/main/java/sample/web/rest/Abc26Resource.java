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
import sample.domain.Abc26;
import sample.repository.Abc26Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc26}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc26Resource {

    private final Logger log = LoggerFactory.getLogger(Abc26Resource.class);

    private static final String ENTITY_NAME = "abc26";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc26Repository abc26Repository;

    public Abc26Resource(Abc26Repository abc26Repository) {
        this.abc26Repository = abc26Repository;
    }

    /**
     * {@code POST  /abc-26-s} : Create a new abc26.
     *
     * @param abc26 the abc26 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc26, or with status {@code 400 (Bad Request)} if the abc26 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-26-s")
    public ResponseEntity<Abc26> createAbc26(@Valid @RequestBody Abc26 abc26) throws URISyntaxException {
        log.debug("REST request to save Abc26 : {}", abc26);
        if (abc26.getId() != null) {
            throw new BadRequestAlertException("A new abc26 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc26 result = abc26Repository.save(abc26);
        return ResponseEntity
            .created(new URI("/api/abc-26-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-26-s/:id} : Updates an existing abc26.
     *
     * @param id the id of the abc26 to save.
     * @param abc26 the abc26 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc26,
     * or with status {@code 400 (Bad Request)} if the abc26 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc26 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-26-s/{id}")
    public ResponseEntity<Abc26> updateAbc26(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc26 abc26)
        throws URISyntaxException {
        log.debug("REST request to update Abc26 : {}, {}", id, abc26);
        if (abc26.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc26.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc26Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc26 result = abc26Repository.save(abc26);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc26.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-26-s/:id} : Partial updates given fields of an existing abc26, field will ignore if it is null
     *
     * @param id the id of the abc26 to save.
     * @param abc26 the abc26 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc26,
     * or with status {@code 400 (Bad Request)} if the abc26 is not valid,
     * or with status {@code 404 (Not Found)} if the abc26 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc26 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-26-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc26> partialUpdateAbc26(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc26 abc26
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc26 partially : {}, {}", id, abc26);
        if (abc26.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc26.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc26Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc26> result = abc26Repository
            .findById(abc26.getId())
            .map(existingAbc26 -> {
                if (abc26.getName() != null) {
                    existingAbc26.setName(abc26.getName());
                }
                if (abc26.getOtherField() != null) {
                    existingAbc26.setOtherField(abc26.getOtherField());
                }

                return existingAbc26;
            })
            .map(abc26Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc26.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-26-s} : get all the abc26s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc26s in body.
     */
    @GetMapping("/abc-26-s")
    public List<Abc26> getAllAbc26s() {
        log.debug("REST request to get all Abc26s");
        return abc26Repository.findAll();
    }

    /**
     * {@code GET  /abc-26-s/:id} : get the "id" abc26.
     *
     * @param id the id of the abc26 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc26, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-26-s/{id}")
    public ResponseEntity<Abc26> getAbc26(@PathVariable Long id) {
        log.debug("REST request to get Abc26 : {}", id);
        Optional<Abc26> abc26 = abc26Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc26);
    }

    /**
     * {@code DELETE  /abc-26-s/:id} : delete the "id" abc26.
     *
     * @param id the id of the abc26 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-26-s/{id}")
    public ResponseEntity<Void> deleteAbc26(@PathVariable Long id) {
        log.debug("REST request to delete Abc26 : {}", id);
        abc26Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
