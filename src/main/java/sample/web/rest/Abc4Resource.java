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
import sample.domain.Abc4;
import sample.repository.Abc4Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc4}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc4Resource {

    private final Logger log = LoggerFactory.getLogger(Abc4Resource.class);

    private static final String ENTITY_NAME = "abc4";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc4Repository abc4Repository;

    public Abc4Resource(Abc4Repository abc4Repository) {
        this.abc4Repository = abc4Repository;
    }

    /**
     * {@code POST  /abc-4-s} : Create a new abc4.
     *
     * @param abc4 the abc4 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc4, or with status {@code 400 (Bad Request)} if the abc4 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-4-s")
    public ResponseEntity<Abc4> createAbc4(@Valid @RequestBody Abc4 abc4) throws URISyntaxException {
        log.debug("REST request to save Abc4 : {}", abc4);
        if (abc4.getId() != null) {
            throw new BadRequestAlertException("A new abc4 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc4 result = abc4Repository.save(abc4);
        return ResponseEntity
            .created(new URI("/api/abc-4-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-4-s/:id} : Updates an existing abc4.
     *
     * @param id the id of the abc4 to save.
     * @param abc4 the abc4 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc4,
     * or with status {@code 400 (Bad Request)} if the abc4 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc4 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-4-s/{id}")
    public ResponseEntity<Abc4> updateAbc4(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc4 abc4)
        throws URISyntaxException {
        log.debug("REST request to update Abc4 : {}, {}", id, abc4);
        if (abc4.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc4.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc4Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc4 result = abc4Repository.save(abc4);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc4.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-4-s/:id} : Partial updates given fields of an existing abc4, field will ignore if it is null
     *
     * @param id the id of the abc4 to save.
     * @param abc4 the abc4 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc4,
     * or with status {@code 400 (Bad Request)} if the abc4 is not valid,
     * or with status {@code 404 (Not Found)} if the abc4 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc4 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-4-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc4> partialUpdateAbc4(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc4 abc4
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc4 partially : {}, {}", id, abc4);
        if (abc4.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc4.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc4Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc4> result = abc4Repository
            .findById(abc4.getId())
            .map(existingAbc4 -> {
                if (abc4.getName() != null) {
                    existingAbc4.setName(abc4.getName());
                }
                if (abc4.getOtherField() != null) {
                    existingAbc4.setOtherField(abc4.getOtherField());
                }

                return existingAbc4;
            })
            .map(abc4Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc4.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-4-s} : get all the abc4s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc4s in body.
     */
    @GetMapping("/abc-4-s")
    public List<Abc4> getAllAbc4s() {
        log.debug("REST request to get all Abc4s");
        return abc4Repository.findAll();
    }

    /**
     * {@code GET  /abc-4-s/:id} : get the "id" abc4.
     *
     * @param id the id of the abc4 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc4, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-4-s/{id}")
    public ResponseEntity<Abc4> getAbc4(@PathVariable Long id) {
        log.debug("REST request to get Abc4 : {}", id);
        Optional<Abc4> abc4 = abc4Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc4);
    }

    /**
     * {@code DELETE  /abc-4-s/:id} : delete the "id" abc4.
     *
     * @param id the id of the abc4 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-4-s/{id}")
    public ResponseEntity<Void> deleteAbc4(@PathVariable Long id) {
        log.debug("REST request to delete Abc4 : {}", id);
        abc4Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
