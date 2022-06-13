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
import sample.domain.Abc15;
import sample.repository.Abc15Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc15}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc15Resource {

    private final Logger log = LoggerFactory.getLogger(Abc15Resource.class);

    private static final String ENTITY_NAME = "abc15";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc15Repository abc15Repository;

    public Abc15Resource(Abc15Repository abc15Repository) {
        this.abc15Repository = abc15Repository;
    }

    /**
     * {@code POST  /abc-15-s} : Create a new abc15.
     *
     * @param abc15 the abc15 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc15, or with status {@code 400 (Bad Request)} if the abc15 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-15-s")
    public ResponseEntity<Abc15> createAbc15(@Valid @RequestBody Abc15 abc15) throws URISyntaxException {
        log.debug("REST request to save Abc15 : {}", abc15);
        if (abc15.getId() != null) {
            throw new BadRequestAlertException("A new abc15 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc15 result = abc15Repository.save(abc15);
        return ResponseEntity
            .created(new URI("/api/abc-15-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-15-s/:id} : Updates an existing abc15.
     *
     * @param id the id of the abc15 to save.
     * @param abc15 the abc15 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc15,
     * or with status {@code 400 (Bad Request)} if the abc15 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc15 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-15-s/{id}")
    public ResponseEntity<Abc15> updateAbc15(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc15 abc15)
        throws URISyntaxException {
        log.debug("REST request to update Abc15 : {}, {}", id, abc15);
        if (abc15.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc15.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc15Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc15 result = abc15Repository.save(abc15);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc15.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-15-s/:id} : Partial updates given fields of an existing abc15, field will ignore if it is null
     *
     * @param id the id of the abc15 to save.
     * @param abc15 the abc15 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc15,
     * or with status {@code 400 (Bad Request)} if the abc15 is not valid,
     * or with status {@code 404 (Not Found)} if the abc15 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc15 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-15-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc15> partialUpdateAbc15(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc15 abc15
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc15 partially : {}, {}", id, abc15);
        if (abc15.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc15.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc15Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc15> result = abc15Repository
            .findById(abc15.getId())
            .map(existingAbc15 -> {
                if (abc15.getName() != null) {
                    existingAbc15.setName(abc15.getName());
                }
                if (abc15.getOtherField() != null) {
                    existingAbc15.setOtherField(abc15.getOtherField());
                }

                return existingAbc15;
            })
            .map(abc15Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc15.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-15-s} : get all the abc15s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc15s in body.
     */
    @GetMapping("/abc-15-s")
    public List<Abc15> getAllAbc15s() {
        log.debug("REST request to get all Abc15s");
        return abc15Repository.findAll();
    }

    /**
     * {@code GET  /abc-15-s/:id} : get the "id" abc15.
     *
     * @param id the id of the abc15 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc15, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-15-s/{id}")
    public ResponseEntity<Abc15> getAbc15(@PathVariable Long id) {
        log.debug("REST request to get Abc15 : {}", id);
        Optional<Abc15> abc15 = abc15Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc15);
    }

    /**
     * {@code DELETE  /abc-15-s/:id} : delete the "id" abc15.
     *
     * @param id the id of the abc15 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-15-s/{id}")
    public ResponseEntity<Void> deleteAbc15(@PathVariable Long id) {
        log.debug("REST request to delete Abc15 : {}", id);
        abc15Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
