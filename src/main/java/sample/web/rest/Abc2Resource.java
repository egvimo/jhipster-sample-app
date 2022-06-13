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
import sample.domain.Abc2;
import sample.repository.Abc2Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc2}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc2Resource {

    private final Logger log = LoggerFactory.getLogger(Abc2Resource.class);

    private static final String ENTITY_NAME = "abc2";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc2Repository abc2Repository;

    public Abc2Resource(Abc2Repository abc2Repository) {
        this.abc2Repository = abc2Repository;
    }

    /**
     * {@code POST  /abc-2-s} : Create a new abc2.
     *
     * @param abc2 the abc2 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc2, or with status {@code 400 (Bad Request)} if the abc2 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-2-s")
    public ResponseEntity<Abc2> createAbc2(@Valid @RequestBody Abc2 abc2) throws URISyntaxException {
        log.debug("REST request to save Abc2 : {}", abc2);
        if (abc2.getId() != null) {
            throw new BadRequestAlertException("A new abc2 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc2 result = abc2Repository.save(abc2);
        return ResponseEntity
            .created(new URI("/api/abc-2-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-2-s/:id} : Updates an existing abc2.
     *
     * @param id the id of the abc2 to save.
     * @param abc2 the abc2 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc2,
     * or with status {@code 400 (Bad Request)} if the abc2 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc2 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-2-s/{id}")
    public ResponseEntity<Abc2> updateAbc2(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc2 abc2)
        throws URISyntaxException {
        log.debug("REST request to update Abc2 : {}, {}", id, abc2);
        if (abc2.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc2.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc2Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc2 result = abc2Repository.save(abc2);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc2.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-2-s/:id} : Partial updates given fields of an existing abc2, field will ignore if it is null
     *
     * @param id the id of the abc2 to save.
     * @param abc2 the abc2 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc2,
     * or with status {@code 400 (Bad Request)} if the abc2 is not valid,
     * or with status {@code 404 (Not Found)} if the abc2 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc2 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-2-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc2> partialUpdateAbc2(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc2 abc2
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc2 partially : {}, {}", id, abc2);
        if (abc2.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc2.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc2Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc2> result = abc2Repository
            .findById(abc2.getId())
            .map(existingAbc2 -> {
                if (abc2.getName() != null) {
                    existingAbc2.setName(abc2.getName());
                }
                if (abc2.getOtherField() != null) {
                    existingAbc2.setOtherField(abc2.getOtherField());
                }

                return existingAbc2;
            })
            .map(abc2Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc2.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-2-s} : get all the abc2s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc2s in body.
     */
    @GetMapping("/abc-2-s")
    public List<Abc2> getAllAbc2s() {
        log.debug("REST request to get all Abc2s");
        return abc2Repository.findAll();
    }

    /**
     * {@code GET  /abc-2-s/:id} : get the "id" abc2.
     *
     * @param id the id of the abc2 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc2, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-2-s/{id}")
    public ResponseEntity<Abc2> getAbc2(@PathVariable Long id) {
        log.debug("REST request to get Abc2 : {}", id);
        Optional<Abc2> abc2 = abc2Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc2);
    }

    /**
     * {@code DELETE  /abc-2-s/:id} : delete the "id" abc2.
     *
     * @param id the id of the abc2 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-2-s/{id}")
    public ResponseEntity<Void> deleteAbc2(@PathVariable Long id) {
        log.debug("REST request to delete Abc2 : {}", id);
        abc2Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
