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
import sample.domain.Abc14;
import sample.repository.Abc14Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc14}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc14Resource {

    private final Logger log = LoggerFactory.getLogger(Abc14Resource.class);

    private static final String ENTITY_NAME = "abc14";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc14Repository abc14Repository;

    public Abc14Resource(Abc14Repository abc14Repository) {
        this.abc14Repository = abc14Repository;
    }

    /**
     * {@code POST  /abc-14-s} : Create a new abc14.
     *
     * @param abc14 the abc14 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc14, or with status {@code 400 (Bad Request)} if the abc14 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-14-s")
    public ResponseEntity<Abc14> createAbc14(@Valid @RequestBody Abc14 abc14) throws URISyntaxException {
        log.debug("REST request to save Abc14 : {}", abc14);
        if (abc14.getId() != null) {
            throw new BadRequestAlertException("A new abc14 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc14 result = abc14Repository.save(abc14);
        return ResponseEntity
            .created(new URI("/api/abc-14-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-14-s/:id} : Updates an existing abc14.
     *
     * @param id the id of the abc14 to save.
     * @param abc14 the abc14 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc14,
     * or with status {@code 400 (Bad Request)} if the abc14 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc14 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-14-s/{id}")
    public ResponseEntity<Abc14> updateAbc14(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc14 abc14)
        throws URISyntaxException {
        log.debug("REST request to update Abc14 : {}, {}", id, abc14);
        if (abc14.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc14.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc14Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc14 result = abc14Repository.save(abc14);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc14.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-14-s/:id} : Partial updates given fields of an existing abc14, field will ignore if it is null
     *
     * @param id the id of the abc14 to save.
     * @param abc14 the abc14 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc14,
     * or with status {@code 400 (Bad Request)} if the abc14 is not valid,
     * or with status {@code 404 (Not Found)} if the abc14 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc14 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-14-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc14> partialUpdateAbc14(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc14 abc14
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc14 partially : {}, {}", id, abc14);
        if (abc14.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc14.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc14Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc14> result = abc14Repository
            .findById(abc14.getId())
            .map(existingAbc14 -> {
                if (abc14.getName() != null) {
                    existingAbc14.setName(abc14.getName());
                }
                if (abc14.getOtherField() != null) {
                    existingAbc14.setOtherField(abc14.getOtherField());
                }

                return existingAbc14;
            })
            .map(abc14Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc14.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-14-s} : get all the abc14s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc14s in body.
     */
    @GetMapping("/abc-14-s")
    public List<Abc14> getAllAbc14s() {
        log.debug("REST request to get all Abc14s");
        return abc14Repository.findAll();
    }

    /**
     * {@code GET  /abc-14-s/:id} : get the "id" abc14.
     *
     * @param id the id of the abc14 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc14, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-14-s/{id}")
    public ResponseEntity<Abc14> getAbc14(@PathVariable Long id) {
        log.debug("REST request to get Abc14 : {}", id);
        Optional<Abc14> abc14 = abc14Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc14);
    }

    /**
     * {@code DELETE  /abc-14-s/:id} : delete the "id" abc14.
     *
     * @param id the id of the abc14 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-14-s/{id}")
    public ResponseEntity<Void> deleteAbc14(@PathVariable Long id) {
        log.debug("REST request to delete Abc14 : {}", id);
        abc14Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
