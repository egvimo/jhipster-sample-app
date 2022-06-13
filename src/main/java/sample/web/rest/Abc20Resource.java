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
import sample.domain.Abc20;
import sample.repository.Abc20Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc20}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc20Resource {

    private final Logger log = LoggerFactory.getLogger(Abc20Resource.class);

    private static final String ENTITY_NAME = "abc20";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc20Repository abc20Repository;

    public Abc20Resource(Abc20Repository abc20Repository) {
        this.abc20Repository = abc20Repository;
    }

    /**
     * {@code POST  /abc-20-s} : Create a new abc20.
     *
     * @param abc20 the abc20 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc20, or with status {@code 400 (Bad Request)} if the abc20 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-20-s")
    public ResponseEntity<Abc20> createAbc20(@Valid @RequestBody Abc20 abc20) throws URISyntaxException {
        log.debug("REST request to save Abc20 : {}", abc20);
        if (abc20.getId() != null) {
            throw new BadRequestAlertException("A new abc20 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc20 result = abc20Repository.save(abc20);
        return ResponseEntity
            .created(new URI("/api/abc-20-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-20-s/:id} : Updates an existing abc20.
     *
     * @param id the id of the abc20 to save.
     * @param abc20 the abc20 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc20,
     * or with status {@code 400 (Bad Request)} if the abc20 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc20 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-20-s/{id}")
    public ResponseEntity<Abc20> updateAbc20(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc20 abc20)
        throws URISyntaxException {
        log.debug("REST request to update Abc20 : {}, {}", id, abc20);
        if (abc20.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc20.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc20Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc20 result = abc20Repository.save(abc20);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc20.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-20-s/:id} : Partial updates given fields of an existing abc20, field will ignore if it is null
     *
     * @param id the id of the abc20 to save.
     * @param abc20 the abc20 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc20,
     * or with status {@code 400 (Bad Request)} if the abc20 is not valid,
     * or with status {@code 404 (Not Found)} if the abc20 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc20 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-20-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc20> partialUpdateAbc20(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc20 abc20
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc20 partially : {}, {}", id, abc20);
        if (abc20.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc20.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc20Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc20> result = abc20Repository
            .findById(abc20.getId())
            .map(existingAbc20 -> {
                if (abc20.getName() != null) {
                    existingAbc20.setName(abc20.getName());
                }
                if (abc20.getOtherField() != null) {
                    existingAbc20.setOtherField(abc20.getOtherField());
                }

                return existingAbc20;
            })
            .map(abc20Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc20.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-20-s} : get all the abc20s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc20s in body.
     */
    @GetMapping("/abc-20-s")
    public List<Abc20> getAllAbc20s() {
        log.debug("REST request to get all Abc20s");
        return abc20Repository.findAll();
    }

    /**
     * {@code GET  /abc-20-s/:id} : get the "id" abc20.
     *
     * @param id the id of the abc20 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc20, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-20-s/{id}")
    public ResponseEntity<Abc20> getAbc20(@PathVariable Long id) {
        log.debug("REST request to get Abc20 : {}", id);
        Optional<Abc20> abc20 = abc20Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc20);
    }

    /**
     * {@code DELETE  /abc-20-s/:id} : delete the "id" abc20.
     *
     * @param id the id of the abc20 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-20-s/{id}")
    public ResponseEntity<Void> deleteAbc20(@PathVariable Long id) {
        log.debug("REST request to delete Abc20 : {}", id);
        abc20Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
