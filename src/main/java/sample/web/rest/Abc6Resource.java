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
import sample.domain.Abc6;
import sample.repository.Abc6Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc6}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc6Resource {

    private final Logger log = LoggerFactory.getLogger(Abc6Resource.class);

    private static final String ENTITY_NAME = "abc6";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc6Repository abc6Repository;

    public Abc6Resource(Abc6Repository abc6Repository) {
        this.abc6Repository = abc6Repository;
    }

    /**
     * {@code POST  /abc-6-s} : Create a new abc6.
     *
     * @param abc6 the abc6 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc6, or with status {@code 400 (Bad Request)} if the abc6 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-6-s")
    public ResponseEntity<Abc6> createAbc6(@Valid @RequestBody Abc6 abc6) throws URISyntaxException {
        log.debug("REST request to save Abc6 : {}", abc6);
        if (abc6.getId() != null) {
            throw new BadRequestAlertException("A new abc6 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc6 result = abc6Repository.save(abc6);
        return ResponseEntity
            .created(new URI("/api/abc-6-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-6-s/:id} : Updates an existing abc6.
     *
     * @param id the id of the abc6 to save.
     * @param abc6 the abc6 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc6,
     * or with status {@code 400 (Bad Request)} if the abc6 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc6 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-6-s/{id}")
    public ResponseEntity<Abc6> updateAbc6(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc6 abc6)
        throws URISyntaxException {
        log.debug("REST request to update Abc6 : {}, {}", id, abc6);
        if (abc6.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc6.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc6Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc6 result = abc6Repository.save(abc6);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc6.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-6-s/:id} : Partial updates given fields of an existing abc6, field will ignore if it is null
     *
     * @param id the id of the abc6 to save.
     * @param abc6 the abc6 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc6,
     * or with status {@code 400 (Bad Request)} if the abc6 is not valid,
     * or with status {@code 404 (Not Found)} if the abc6 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc6 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-6-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc6> partialUpdateAbc6(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc6 abc6
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc6 partially : {}, {}", id, abc6);
        if (abc6.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc6.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc6Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc6> result = abc6Repository
            .findById(abc6.getId())
            .map(existingAbc6 -> {
                if (abc6.getName() != null) {
                    existingAbc6.setName(abc6.getName());
                }
                if (abc6.getOtherField() != null) {
                    existingAbc6.setOtherField(abc6.getOtherField());
                }

                return existingAbc6;
            })
            .map(abc6Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc6.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-6-s} : get all the abc6s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc6s in body.
     */
    @GetMapping("/abc-6-s")
    public List<Abc6> getAllAbc6s() {
        log.debug("REST request to get all Abc6s");
        return abc6Repository.findAll();
    }

    /**
     * {@code GET  /abc-6-s/:id} : get the "id" abc6.
     *
     * @param id the id of the abc6 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc6, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-6-s/{id}")
    public ResponseEntity<Abc6> getAbc6(@PathVariable Long id) {
        log.debug("REST request to get Abc6 : {}", id);
        Optional<Abc6> abc6 = abc6Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc6);
    }

    /**
     * {@code DELETE  /abc-6-s/:id} : delete the "id" abc6.
     *
     * @param id the id of the abc6 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-6-s/{id}")
    public ResponseEntity<Void> deleteAbc6(@PathVariable Long id) {
        log.debug("REST request to delete Abc6 : {}", id);
        abc6Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
