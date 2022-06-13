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
import sample.domain.Abc22;
import sample.repository.Abc22Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc22}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc22Resource {

    private final Logger log = LoggerFactory.getLogger(Abc22Resource.class);

    private static final String ENTITY_NAME = "abc22";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc22Repository abc22Repository;

    public Abc22Resource(Abc22Repository abc22Repository) {
        this.abc22Repository = abc22Repository;
    }

    /**
     * {@code POST  /abc-22-s} : Create a new abc22.
     *
     * @param abc22 the abc22 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc22, or with status {@code 400 (Bad Request)} if the abc22 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-22-s")
    public ResponseEntity<Abc22> createAbc22(@Valid @RequestBody Abc22 abc22) throws URISyntaxException {
        log.debug("REST request to save Abc22 : {}", abc22);
        if (abc22.getId() != null) {
            throw new BadRequestAlertException("A new abc22 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc22 result = abc22Repository.save(abc22);
        return ResponseEntity
            .created(new URI("/api/abc-22-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-22-s/:id} : Updates an existing abc22.
     *
     * @param id the id of the abc22 to save.
     * @param abc22 the abc22 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc22,
     * or with status {@code 400 (Bad Request)} if the abc22 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc22 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-22-s/{id}")
    public ResponseEntity<Abc22> updateAbc22(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc22 abc22)
        throws URISyntaxException {
        log.debug("REST request to update Abc22 : {}, {}", id, abc22);
        if (abc22.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc22.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc22Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc22 result = abc22Repository.save(abc22);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc22.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-22-s/:id} : Partial updates given fields of an existing abc22, field will ignore if it is null
     *
     * @param id the id of the abc22 to save.
     * @param abc22 the abc22 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc22,
     * or with status {@code 400 (Bad Request)} if the abc22 is not valid,
     * or with status {@code 404 (Not Found)} if the abc22 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc22 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-22-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc22> partialUpdateAbc22(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc22 abc22
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc22 partially : {}, {}", id, abc22);
        if (abc22.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc22.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc22Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc22> result = abc22Repository
            .findById(abc22.getId())
            .map(existingAbc22 -> {
                if (abc22.getName() != null) {
                    existingAbc22.setName(abc22.getName());
                }
                if (abc22.getOtherField() != null) {
                    existingAbc22.setOtherField(abc22.getOtherField());
                }

                return existingAbc22;
            })
            .map(abc22Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc22.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-22-s} : get all the abc22s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc22s in body.
     */
    @GetMapping("/abc-22-s")
    public List<Abc22> getAllAbc22s() {
        log.debug("REST request to get all Abc22s");
        return abc22Repository.findAll();
    }

    /**
     * {@code GET  /abc-22-s/:id} : get the "id" abc22.
     *
     * @param id the id of the abc22 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc22, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-22-s/{id}")
    public ResponseEntity<Abc22> getAbc22(@PathVariable Long id) {
        log.debug("REST request to get Abc22 : {}", id);
        Optional<Abc22> abc22 = abc22Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc22);
    }

    /**
     * {@code DELETE  /abc-22-s/:id} : delete the "id" abc22.
     *
     * @param id the id of the abc22 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-22-s/{id}")
    public ResponseEntity<Void> deleteAbc22(@PathVariable Long id) {
        log.debug("REST request to delete Abc22 : {}", id);
        abc22Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
