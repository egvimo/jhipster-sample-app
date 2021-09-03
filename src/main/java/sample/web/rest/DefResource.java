package sample.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sample.domain.Def;
import sample.repository.DefRepository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Def}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DefResource {

    private final Logger log = LoggerFactory.getLogger(DefResource.class);

    private static final String ENTITY_NAME = "def";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DefRepository defRepository;

    public DefResource(DefRepository defRepository) {
        this.defRepository = defRepository;
    }

    /**
     * {@code POST  /defs} : Create a new def.
     *
     * @param def the def to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new def, or with status {@code 400 (Bad Request)} if the def has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/defs")
    public ResponseEntity<Def> createDef(@RequestBody Def def) throws URISyntaxException {
        log.debug("REST request to save Def : {}", def);
        if (def.getId() != null) {
            throw new BadRequestAlertException("A new def cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Def result = defRepository.save(def);
        return ResponseEntity
            .created(new URI("/api/defs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /defs/:id} : Updates an existing def.
     *
     * @param id the id of the def to save.
     * @param def the def to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated def,
     * or with status {@code 400 (Bad Request)} if the def is not valid,
     * or with status {@code 500 (Internal Server Error)} if the def couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/defs/{id}")
    public ResponseEntity<Def> updateDef(@PathVariable(value = "id", required = false) final Long id, @RequestBody Def def)
        throws URISyntaxException {
        log.debug("REST request to update Def : {}, {}", id, def);
        if (def.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, def.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!defRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Def result = defRepository.save(def);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, def.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /defs/:id} : Partial updates given fields of an existing def, field will ignore if it is null
     *
     * @param id the id of the def to save.
     * @param def the def to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated def,
     * or with status {@code 400 (Bad Request)} if the def is not valid,
     * or with status {@code 404 (Not Found)} if the def is not found,
     * or with status {@code 500 (Internal Server Error)} if the def couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/defs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Def> partialUpdateDef(@PathVariable(value = "id", required = false) final Long id, @RequestBody Def def)
        throws URISyntaxException {
        log.debug("REST request to partial update Def partially : {}, {}", id, def);
        if (def.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, def.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!defRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Def> result = defRepository
            .findById(def.getId())
            .map(
                existingDef -> {
                    if (def.getName() != null) {
                        existingDef.setName(def.getName());
                    }

                    return existingDef;
                }
            )
            .map(defRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, def.getId().toString())
        );
    }

    /**
     * {@code GET  /defs} : get all the defs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of defs in body.
     */
    @GetMapping("/defs")
    public List<Def> getAllDefs() {
        log.debug("REST request to get all Defs");
        return defRepository.findAll();
    }

    /**
     * {@code GET  /defs/:id} : get the "id" def.
     *
     * @param id the id of the def to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the def, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/defs/{id}")
    public ResponseEntity<Def> getDef(@PathVariable Long id) {
        log.debug("REST request to get Def : {}", id);
        Optional<Def> def = defRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(def);
    }

    /**
     * {@code DELETE  /defs/:id} : delete the "id" def.
     *
     * @param id the id of the def to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/defs/{id}")
    public ResponseEntity<Void> deleteDef(@PathVariable Long id) {
        log.debug("REST request to delete Def : {}", id);
        defRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
