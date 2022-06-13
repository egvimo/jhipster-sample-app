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
import sample.domain.Abc19;
import sample.repository.Abc19Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc19}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc19Resource {

    private final Logger log = LoggerFactory.getLogger(Abc19Resource.class);

    private static final String ENTITY_NAME = "abc19";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc19Repository abc19Repository;

    public Abc19Resource(Abc19Repository abc19Repository) {
        this.abc19Repository = abc19Repository;
    }

    /**
     * {@code POST  /abc-19-s} : Create a new abc19.
     *
     * @param abc19 the abc19 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc19, or with status {@code 400 (Bad Request)} if the abc19 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-19-s")
    public ResponseEntity<Abc19> createAbc19(@Valid @RequestBody Abc19 abc19) throws URISyntaxException {
        log.debug("REST request to save Abc19 : {}", abc19);
        if (abc19.getId() != null) {
            throw new BadRequestAlertException("A new abc19 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc19 result = abc19Repository.save(abc19);
        return ResponseEntity
            .created(new URI("/api/abc-19-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-19-s/:id} : Updates an existing abc19.
     *
     * @param id the id of the abc19 to save.
     * @param abc19 the abc19 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc19,
     * or with status {@code 400 (Bad Request)} if the abc19 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc19 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-19-s/{id}")
    public ResponseEntity<Abc19> updateAbc19(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc19 abc19)
        throws URISyntaxException {
        log.debug("REST request to update Abc19 : {}, {}", id, abc19);
        if (abc19.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc19.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc19Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc19 result = abc19Repository.save(abc19);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc19.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-19-s/:id} : Partial updates given fields of an existing abc19, field will ignore if it is null
     *
     * @param id the id of the abc19 to save.
     * @param abc19 the abc19 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc19,
     * or with status {@code 400 (Bad Request)} if the abc19 is not valid,
     * or with status {@code 404 (Not Found)} if the abc19 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc19 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-19-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc19> partialUpdateAbc19(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc19 abc19
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc19 partially : {}, {}", id, abc19);
        if (abc19.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc19.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc19Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc19> result = abc19Repository
            .findById(abc19.getId())
            .map(existingAbc19 -> {
                if (abc19.getName() != null) {
                    existingAbc19.setName(abc19.getName());
                }
                if (abc19.getOtherField() != null) {
                    existingAbc19.setOtherField(abc19.getOtherField());
                }

                return existingAbc19;
            })
            .map(abc19Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc19.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-19-s} : get all the abc19s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc19s in body.
     */
    @GetMapping("/abc-19-s")
    public List<Abc19> getAllAbc19s() {
        log.debug("REST request to get all Abc19s");
        return abc19Repository.findAll();
    }

    /**
     * {@code GET  /abc-19-s/:id} : get the "id" abc19.
     *
     * @param id the id of the abc19 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc19, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-19-s/{id}")
    public ResponseEntity<Abc19> getAbc19(@PathVariable Long id) {
        log.debug("REST request to get Abc19 : {}", id);
        Optional<Abc19> abc19 = abc19Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc19);
    }

    /**
     * {@code DELETE  /abc-19-s/:id} : delete the "id" abc19.
     *
     * @param id the id of the abc19 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-19-s/{id}")
    public ResponseEntity<Void> deleteAbc19(@PathVariable Long id) {
        log.debug("REST request to delete Abc19 : {}", id);
        abc19Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
