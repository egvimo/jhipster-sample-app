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
import sample.domain.Abc5;
import sample.repository.Abc5Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc5}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc5Resource {

    private final Logger log = LoggerFactory.getLogger(Abc5Resource.class);

    private static final String ENTITY_NAME = "abc5";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc5Repository abc5Repository;

    public Abc5Resource(Abc5Repository abc5Repository) {
        this.abc5Repository = abc5Repository;
    }

    /**
     * {@code POST  /abc-5-s} : Create a new abc5.
     *
     * @param abc5 the abc5 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc5, or with status {@code 400 (Bad Request)} if the abc5 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-5-s")
    public ResponseEntity<Abc5> createAbc5(@Valid @RequestBody Abc5 abc5) throws URISyntaxException {
        log.debug("REST request to save Abc5 : {}", abc5);
        if (abc5.getId() != null) {
            throw new BadRequestAlertException("A new abc5 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc5 result = abc5Repository.save(abc5);
        return ResponseEntity
            .created(new URI("/api/abc-5-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-5-s/:id} : Updates an existing abc5.
     *
     * @param id the id of the abc5 to save.
     * @param abc5 the abc5 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc5,
     * or with status {@code 400 (Bad Request)} if the abc5 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc5 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-5-s/{id}")
    public ResponseEntity<Abc5> updateAbc5(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc5 abc5)
        throws URISyntaxException {
        log.debug("REST request to update Abc5 : {}, {}", id, abc5);
        if (abc5.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc5.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc5Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc5 result = abc5Repository.save(abc5);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc5.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-5-s/:id} : Partial updates given fields of an existing abc5, field will ignore if it is null
     *
     * @param id the id of the abc5 to save.
     * @param abc5 the abc5 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc5,
     * or with status {@code 400 (Bad Request)} if the abc5 is not valid,
     * or with status {@code 404 (Not Found)} if the abc5 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc5 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-5-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc5> partialUpdateAbc5(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc5 abc5
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc5 partially : {}, {}", id, abc5);
        if (abc5.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc5.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc5Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc5> result = abc5Repository
            .findById(abc5.getId())
            .map(existingAbc5 -> {
                if (abc5.getName() != null) {
                    existingAbc5.setName(abc5.getName());
                }
                if (abc5.getOtherField() != null) {
                    existingAbc5.setOtherField(abc5.getOtherField());
                }

                return existingAbc5;
            })
            .map(abc5Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc5.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-5-s} : get all the abc5s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc5s in body.
     */
    @GetMapping("/abc-5-s")
    public List<Abc5> getAllAbc5s() {
        log.debug("REST request to get all Abc5s");
        return abc5Repository.findAll();
    }

    /**
     * {@code GET  /abc-5-s/:id} : get the "id" abc5.
     *
     * @param id the id of the abc5 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc5, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-5-s/{id}")
    public ResponseEntity<Abc5> getAbc5(@PathVariable Long id) {
        log.debug("REST request to get Abc5 : {}", id);
        Optional<Abc5> abc5 = abc5Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc5);
    }

    /**
     * {@code DELETE  /abc-5-s/:id} : delete the "id" abc5.
     *
     * @param id the id of the abc5 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-5-s/{id}")
    public ResponseEntity<Void> deleteAbc5(@PathVariable Long id) {
        log.debug("REST request to delete Abc5 : {}", id);
        abc5Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
