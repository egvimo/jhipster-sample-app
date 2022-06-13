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
import sample.domain.Abc1;
import sample.repository.Abc1Repository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc1}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class Abc1Resource {

    private final Logger log = LoggerFactory.getLogger(Abc1Resource.class);

    private static final String ENTITY_NAME = "abc1";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final Abc1Repository abc1Repository;

    public Abc1Resource(Abc1Repository abc1Repository) {
        this.abc1Repository = abc1Repository;
    }

    /**
     * {@code POST  /abc-1-s} : Create a new abc1.
     *
     * @param abc1 the abc1 to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc1, or with status {@code 400 (Bad Request)} if the abc1 has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abc-1-s")
    public ResponseEntity<Abc1> createAbc1(@Valid @RequestBody Abc1 abc1) throws URISyntaxException {
        log.debug("REST request to save Abc1 : {}", abc1);
        if (abc1.getId() != null) {
            throw new BadRequestAlertException("A new abc1 cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc1 result = abc1Repository.save(abc1);
        return ResponseEntity
            .created(new URI("/api/abc-1-s/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abc-1-s/:id} : Updates an existing abc1.
     *
     * @param id the id of the abc1 to save.
     * @param abc1 the abc1 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc1,
     * or with status {@code 400 (Bad Request)} if the abc1 is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc1 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abc-1-s/{id}")
    public ResponseEntity<Abc1> updateAbc1(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Abc1 abc1)
        throws URISyntaxException {
        log.debug("REST request to update Abc1 : {}, {}", id, abc1);
        if (abc1.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc1.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc1Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Abc1 result = abc1Repository.save(abc1);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc1.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abc-1-s/:id} : Partial updates given fields of an existing abc1, field will ignore if it is null
     *
     * @param id the id of the abc1 to save.
     * @param abc1 the abc1 to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc1,
     * or with status {@code 400 (Bad Request)} if the abc1 is not valid,
     * or with status {@code 404 (Not Found)} if the abc1 is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc1 couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abc-1-s/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Abc1> partialUpdateAbc1(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Abc1 abc1
    ) throws URISyntaxException {
        log.debug("REST request to partial update Abc1 partially : {}, {}", id, abc1);
        if (abc1.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, abc1.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!abc1Repository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Abc1> result = abc1Repository
            .findById(abc1.getId())
            .map(existingAbc1 -> {
                if (abc1.getName() != null) {
                    existingAbc1.setName(abc1.getName());
                }
                if (abc1.getOtherField() != null) {
                    existingAbc1.setOtherField(abc1.getOtherField());
                }

                return existingAbc1;
            })
            .map(abc1Repository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc1.getId().toString())
        );
    }

    /**
     * {@code GET  /abc-1-s} : get all the abc1s.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abc1s in body.
     */
    @GetMapping("/abc-1-s")
    public List<Abc1> getAllAbc1s() {
        log.debug("REST request to get all Abc1s");
        return abc1Repository.findAll();
    }

    /**
     * {@code GET  /abc-1-s/:id} : get the "id" abc1.
     *
     * @param id the id of the abc1 to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc1, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abc-1-s/{id}")
    public ResponseEntity<Abc1> getAbc1(@PathVariable Long id) {
        log.debug("REST request to get Abc1 : {}", id);
        Optional<Abc1> abc1 = abc1Repository.findById(id);
        return ResponseUtil.wrapOrNotFound(abc1);
    }

    /**
     * {@code DELETE  /abc-1-s/:id} : delete the "id" abc1.
     *
     * @param id the id of the abc1 to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abc-1-s/{id}")
    public ResponseEntity<Void> deleteAbc1(@PathVariable Long id) {
        log.debug("REST request to delete Abc1 : {}", id);
        abc1Repository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
