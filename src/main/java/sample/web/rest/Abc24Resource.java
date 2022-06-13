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
import sample.domain.Abc24;
import sample.repository.Abc24Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc24}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc24Resource {

    private final Logger log = LoggerFactory.getLogger(Abc24Resource.class);

    private static final String ENTITY_NAME = "abc24";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc24Repository abc24Repository;

    public Abc24Resource(Abc24Repository abc24Repository) {
        this.abc24Repository = abc24Repository;
    }

    /**
     * {@code POST  /abc-24-s} : Create a new abc24.
     *
     * @param abc24 the abc24 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc24, or with status {@code 400 (Bad Request)} if the abc24 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-24-s")
    public ResponseEntity<Abc24> createAbc24(@Valid @RequestBody Abc24 abc24) throws URISyntaxException {
        log.debug("REST request to save Abc24 : {}", abc24);
        if (abc24.getId() != null) {
            throw new BadRequestAlertException("A new abc24 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc24 result = abc24Repository.save(abc24);
        return ResponseEntity
            .created(new URI("/api/abc-24-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-24-s/:id} : Updates an existing abc24.
     *
     * @param id the id of the abc24 to save.
     * @param abc24 the abc24 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc24,
     * or with status {@code 400 (Bad Request)} if the abc24 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc24 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-24-s/{id}")
    public ResponseEntity<Abc24> updateAbc24(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc24 abc24)
        throws URISyntaxException {
        log.debug("REST request to update Abc24 : {}, {}", id, abc24);
        if (abc24.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc24.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc24Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc24 result = abc24Repository.save(abc24);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc24.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-24-s/:id} : Partial updates given fields of an existing abc24, field will ignore if it is null
     *
     * @param id the id of the abc24 to save.
     * @param abc24 the abc24 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc24,
     * or with status {@code 400 (Bad Request)} if the abc24 is not valid,
     * or with status {@code 404 (Not Found)} if the abc24 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc24 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-24-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc24> partialUpdateAbc24(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc24 abc24
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc24 partially : {}, {}", id, abc24);
        if (abc24.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc24.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc24Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc24> result = abc24Repository
            .findById(abc24.getId())
            .map(existingAbc24 -> {
                if (abc24.getName() != null) {
                    existingAbc24.setName(abc24.getName());
                }
                if (abc24.getOtherField() != null) {
                    existingAbc24.setOtherField(abc24.getOtherField());
                }

                return existingAbc24;
            })
            .map(abc24Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc24.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-24-s} : get all the abc24s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc24s in body.
     */
    @GetMapping("/abc-24-s")
    public List<Abc24> getAllAbc24s() {
        log.debug("REST request to get all Abc24s");
        return abc24Repository.findAll();
    }

    /**
     * {@code GET  /abc-24-s/:id} : get the "id" abc24.
     *
     * @param id the id of the abc24 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc24, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-24-s/{id}")
    public ResponseEntity<Abc24> getAbc24(@PathVariable Long id) {
        log.debug("REST request to get Abc24 : {}", id);
        Optional<Abc24> abc24 = abc24Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc24);
    }

    /**
     * {@code DELETE  /abc-24-s/:id} : delete the "id" abc24.
     *
     * @param id the id of the abc24 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-24-s/{id}")
    public ResponseEntity<Void> deleteAbc24(@PathVariable Long id) {
        log.debug("REST request to delete Abc24 : {}", id);
        abc24Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
