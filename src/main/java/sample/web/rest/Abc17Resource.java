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
import sample.domain.Abc17;
import sample.repository.Abc17Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc17}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc17Resource {

    private final Logger log = LoggerFactory.getLogger(Abc17Resource.class);

    private static final String ENTITY_NAME = "abc17";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc17Repository abc17Repository;

    public Abc17Resource(Abc17Repository abc17Repository) {
        this.abc17Repository = abc17Repository;
    }

    /**
     * {@code POST  /abc-17-s} : Create a new abc17.
     *
     * @param abc17 the abc17 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc17, or with status {@code 400 (Bad Request)} if the abc17 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-17-s")
    public ResponseEntity<Abc17> createAbc17(@Valid @RequestBody Abc17 abc17) throws URISyntaxException {
        log.debug("REST request to save Abc17 : {}", abc17);
        if (abc17.getId() != null) {
            throw new BadRequestAlertException("A new abc17 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc17 result = abc17Repository.save(abc17);
        return ResponseEntity
            .created(new URI("/api/abc-17-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-17-s/:id} : Updates an existing abc17.
     *
     * @param id the id of the abc17 to save.
     * @param abc17 the abc17 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc17,
     * or with status {@code 400 (Bad Request)} if the abc17 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc17 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-17-s/{id}")
    public ResponseEntity<Abc17> updateAbc17(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc17 abc17)
        throws URISyntaxException {
        log.debug("REST request to update Abc17 : {}, {}", id, abc17);
        if (abc17.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc17.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc17Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc17 result = abc17Repository.save(abc17);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc17.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-17-s/:id} : Partial updates given fields of an existing abc17, field will ignore if it is null
     *
     * @param id the id of the abc17 to save.
     * @param abc17 the abc17 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc17,
     * or with status {@code 400 (Bad Request)} if the abc17 is not valid,
     * or with status {@code 404 (Not Found)} if the abc17 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc17 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-17-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc17> partialUpdateAbc17(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc17 abc17
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc17 partially : {}, {}", id, abc17);
        if (abc17.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc17.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc17Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc17> result = abc17Repository
            .findById(abc17.getId())
            .map(existingAbc17 -> {
                if (abc17.getName() != null) {
                    existingAbc17.setName(abc17.getName());
                }
                if (abc17.getOtherField() != null) {
                    existingAbc17.setOtherField(abc17.getOtherField());
                }

                return existingAbc17;
            })
            .map(abc17Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc17.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-17-s} : get all the abc17s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc17s in body.
     */
    @GetMapping("/abc-17-s")
    public List<Abc17> getAllAbc17s() {
        log.debug("REST request to get all Abc17s");
        return abc17Repository.findAll();
    }

    /**
     * {@code GET  /abc-17-s/:id} : get the "id" abc17.
     *
     * @param id the id of the abc17 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc17, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-17-s/{id}")
    public ResponseEntity<Abc17> getAbc17(@PathVariable Long id) {
        log.debug("REST request to get Abc17 : {}", id);
        Optional<Abc17> abc17 = abc17Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc17);
    }

    /**
     * {@code DELETE  /abc-17-s/:id} : delete the "id" abc17.
     *
     * @param id the id of the abc17 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-17-s/{id}")
    public ResponseEntity<Void> deleteAbc17(@PathVariable Long id) {
        log.debug("REST request to delete Abc17 : {}", id);
        abc17Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
