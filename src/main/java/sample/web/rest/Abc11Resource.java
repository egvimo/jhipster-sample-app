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
import sample.domain.Abc11;
import sample.repository.Abc11Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc11}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc11Resource {

    private final Logger log = LoggerFactory.getLogger(Abc11Resource.class);

    private static final String ENTITY_NAME = "abc11";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc11Repository abc11Repository;

    public Abc11Resource(Abc11Repository abc11Repository) {
        this.abc11Repository = abc11Repository;
    }

    /**
     * {@code POST  /abc-11-s} : Create a new abc11.
     *
     * @param abc11 the abc11 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc11, or with status {@code 400 (Bad Request)} if the abc11 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-11-s")
    public ResponseEntity<Abc11> createAbc11(@Valid @RequestBody Abc11 abc11) throws URISyntaxException {
        log.debug("REST request to save Abc11 : {}", abc11);
        if (abc11.getId() != null) {
            throw new BadRequestAlertException("A new abc11 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc11 result = abc11Repository.save(abc11);
        return ResponseEntity
            .created(new URI("/api/abc-11-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-11-s/:id} : Updates an existing abc11.
     *
     * @param id the id of the abc11 to save.
     * @param abc11 the abc11 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc11,
     * or with status {@code 400 (Bad Request)} if the abc11 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc11 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-11-s/{id}")
    public ResponseEntity<Abc11> updateAbc11(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc11 abc11)
        throws URISyntaxException {
        log.debug("REST request to update Abc11 : {}, {}", id, abc11);
        if (abc11.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc11.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc11Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc11 result = abc11Repository.save(abc11);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc11.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-11-s/:id} : Partial updates given fields of an existing abc11, field will ignore if it is null
     *
     * @param id the id of the abc11 to save.
     * @param abc11 the abc11 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc11,
     * or with status {@code 400 (Bad Request)} if the abc11 is not valid,
     * or with status {@code 404 (Not Found)} if the abc11 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc11 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-11-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc11> partialUpdateAbc11(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc11 abc11
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc11 partially : {}, {}", id, abc11);
        if (abc11.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc11.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc11Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc11> result = abc11Repository
            .findById(abc11.getId())
            .map(existingAbc11 -> {
                if (abc11.getName() != null) {
                    existingAbc11.setName(abc11.getName());
                }
                if (abc11.getOtherField() != null) {
                    existingAbc11.setOtherField(abc11.getOtherField());
                }

                return existingAbc11;
            })
            .map(abc11Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc11.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-11-s} : get all the abc11s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc11s in body.
     */
    @GetMapping("/abc-11-s")
    public List<Abc11> getAllAbc11s() {
        log.debug("REST request to get all Abc11s");
        return abc11Repository.findAll();
    }

    /**
     * {@code GET  /abc-11-s/:id} : get the "id" abc11.
     *
     * @param id the id of the abc11 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc11, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-11-s/{id}")
    public ResponseEntity<Abc11> getAbc11(@PathVariable Long id) {
        log.debug("REST request to get Abc11 : {}", id);
        Optional<Abc11> abc11 = abc11Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc11);
    }

    /**
     * {@code DELETE  /abc-11-s/:id} : delete the "id" abc11.
     *
     * @param id the id of the abc11 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-11-s/{id}")
    public ResponseEntity<Void> deleteAbc11(@PathVariable Long id) {
        log.debug("REST request to delete Abc11 : {}", id);
        abc11Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
