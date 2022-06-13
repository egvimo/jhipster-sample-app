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
import sample.domain.Abc10;
import sample.repository.Abc10Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc10}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc10Resource {

    private final Logger log = LoggerFactory.getLogger(Abc10Resource.class);

    private static final String ENTITY_NAME = "abc10";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc10Repository abc10Repository;

    public Abc10Resource(Abc10Repository abc10Repository) {
        this.abc10Repository = abc10Repository;
    }

    /**
     * {@code POST  /abc-10-s} : Create a new abc10.
     *
     * @param abc10 the abc10 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc10, or with status {@code 400 (Bad Request)} if the abc10 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-10-s")
    public ResponseEntity<Abc10> createAbc10(@Valid @RequestBody Abc10 abc10) throws URISyntaxException {
        log.debug("REST request to save Abc10 : {}", abc10);
        if (abc10.getId() != null) {
            throw new BadRequestAlertException("A new abc10 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc10 result = abc10Repository.save(abc10);
        return ResponseEntity
            .created(new URI("/api/abc-10-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-10-s/:id} : Updates an existing abc10.
     *
     * @param id the id of the abc10 to save.
     * @param abc10 the abc10 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc10,
     * or with status {@code 400 (Bad Request)} if the abc10 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc10 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-10-s/{id}")
    public ResponseEntity<Abc10> updateAbc10(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc10 abc10)
        throws URISyntaxException {
        log.debug("REST request to update Abc10 : {}, {}", id, abc10);
        if (abc10.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc10.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc10Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc10 result = abc10Repository.save(abc10);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc10.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-10-s/:id} : Partial updates given fields of an existing abc10, field will ignore if it is null
     *
     * @param id the id of the abc10 to save.
     * @param abc10 the abc10 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc10,
     * or with status {@code 400 (Bad Request)} if the abc10 is not valid,
     * or with status {@code 404 (Not Found)} if the abc10 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc10 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-10-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc10> partialUpdateAbc10(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc10 abc10
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc10 partially : {}, {}", id, abc10);
        if (abc10.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc10.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc10Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc10> result = abc10Repository
            .findById(abc10.getId())
            .map(existingAbc10 -> {
                if (abc10.getName() != null) {
                    existingAbc10.setName(abc10.getName());
                }
                if (abc10.getOtherField() != null) {
                    existingAbc10.setOtherField(abc10.getOtherField());
                }

                return existingAbc10;
            })
            .map(abc10Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc10.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-10-s} : get all the abc10s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc10s in body.
     */
    @GetMapping("/abc-10-s")
    public List<Abc10> getAllAbc10s() {
        log.debug("REST request to get all Abc10s");
        return abc10Repository.findAll();
    }

    /**
     * {@code GET  /abc-10-s/:id} : get the "id" abc10.
     *
     * @param id the id of the abc10 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc10, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-10-s/{id}")
    public ResponseEntity<Abc10> getAbc10(@PathVariable Long id) {
        log.debug("REST request to get Abc10 : {}", id);
        Optional<Abc10> abc10 = abc10Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc10);
    }

    /**
     * {@code DELETE  /abc-10-s/:id} : delete the "id" abc10.
     *
     * @param id the id of the abc10 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-10-s/{id}")
    public ResponseEntity<Void> deleteAbc10(@PathVariable Long id) {
        log.debug("REST request to delete Abc10 : {}", id);
        abc10Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
