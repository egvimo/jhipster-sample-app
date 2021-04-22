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
import sample.domain.JoinTableAbcXyz;
import sample.repository.JoinTableAbcXyzRepository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.JoinTableAbcXyz}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JoinTableAbcXyzResource {

    private final Logger log = LoggerFactory.getLogger(JoinTableAbcXyzResource.class);

    private static final String ENTITY_NAME = "joinTableAbcXyz";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JoinTableAbcXyzRepository joinTableAbcXyzRepository;

    public JoinTableAbcXyzResource(JoinTableAbcXyzRepository joinTableAbcXyzRepository) {
        this.joinTableAbcXyzRepository = joinTableAbcXyzRepository;
    }

    /**
     * {@code POST  /join-table-abc-xyzs} : Create a new joinTableAbcXyz.
     *
     * @param joinTableAbcXyz the joinTableAbcXyz to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new joinTableAbcXyz, or with status {@code 400 (Bad Request)} if the joinTableAbcXyz has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/join-table-abc-xyzs")
    public ResponseEntity<JoinTableAbcXyz> createJoinTableAbcXyz(@Valid @RequestBody JoinTableAbcXyz joinTableAbcXyz)
        throws URISyntaxException {
        log.debug("REST request to save JoinTableAbcXyz : {}", joinTableAbcXyz);
        if (joinTableAbcXyz.getId() != null) {
            throw new BadRequestAlertException("A new joinTableAbcXyz cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JoinTableAbcXyz result = joinTableAbcXyzRepository.save(joinTableAbcXyz);
        return ResponseEntity
            .created(new URI("/api/join-table-abc-xyzs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /join-table-abc-xyzs/:id} : Updates an existing joinTableAbcXyz.
     *
     * @param id the id of the joinTableAbcXyz to save.
     * @param joinTableAbcXyz the joinTableAbcXyz to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated joinTableAbcXyz,
     * or with status {@code 400 (Bad Request)} if the joinTableAbcXyz is not valid,
     * or with status {@code 500 (Internal Server Error)} if the joinTableAbcXyz couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/join-table-abc-xyzs/{id}")
    public ResponseEntity<JoinTableAbcXyz> updateJoinTableAbcXyz(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody JoinTableAbcXyz joinTableAbcXyz
    ) throws URISyntaxException {
        log.debug("REST request to update JoinTableAbcXyz : {}, {}", id, joinTableAbcXyz);
        if (joinTableAbcXyz.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, joinTableAbcXyz.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!joinTableAbcXyzRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        JoinTableAbcXyz result = joinTableAbcXyzRepository.save(joinTableAbcXyz);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, joinTableAbcXyz.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /join-table-abc-xyzs/:id} : Partial updates given fields of an existing joinTableAbcXyz, field will ignore if it is null
     *
     * @param id the id of the joinTableAbcXyz to save.
     * @param joinTableAbcXyz the joinTableAbcXyz to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated joinTableAbcXyz,
     * or with status {@code 400 (Bad Request)} if the joinTableAbcXyz is not valid,
     * or with status {@code 404 (Not Found)} if the joinTableAbcXyz is not found,
     * or with status {@code 500 (Internal Server Error)} if the joinTableAbcXyz couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/join-table-abc-xyzs/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<JoinTableAbcXyz> partialUpdateJoinTableAbcXyz(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody JoinTableAbcXyz joinTableAbcXyz
    ) throws URISyntaxException {
        log.debug("REST request to partial update JoinTableAbcXyz partially : {}, {}", id, joinTableAbcXyz);
        if (joinTableAbcXyz.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, joinTableAbcXyz.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!joinTableAbcXyzRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<JoinTableAbcXyz> result = joinTableAbcXyzRepository
            .findById(joinTableAbcXyz.getId())
            .map(
                existingJoinTableAbcXyz -> {
                    if (joinTableAbcXyz.getAdditionalColumn() != null) {
                        existingJoinTableAbcXyz.setAdditionalColumn(joinTableAbcXyz.getAdditionalColumn());
                    }

                    return existingJoinTableAbcXyz;
                }
            )
            .map(joinTableAbcXyzRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, joinTableAbcXyz.getId().toString())
        );
    }

    /**
     * {@code GET  /join-table-abc-xyzs} : get all the joinTableAbcXyzs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of joinTableAbcXyzs in body.
     */
    @GetMapping("/join-table-abc-xyzs")
    public List<JoinTableAbcXyz> getAllJoinTableAbcXyzs() {
        log.debug("REST request to get all JoinTableAbcXyzs");
        return joinTableAbcXyzRepository.findAll();
    }

    /**
     * {@code GET  /join-table-abc-xyzs/:id} : get the "id" joinTableAbcXyz.
     *
     * @param id the id of the joinTableAbcXyz to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the joinTableAbcXyz, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/join-table-abc-xyzs/{id}")
    public ResponseEntity<JoinTableAbcXyz> getJoinTableAbcXyz(@PathVariable Long id) {
        log.debug("REST request to get JoinTableAbcXyz : {}", id);
        Optional<JoinTableAbcXyz> joinTableAbcXyz = joinTableAbcXyzRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(joinTableAbcXyz);
    }

    /**
     * {@code DELETE  /join-table-abc-xyzs/:id} : delete the "id" joinTableAbcXyz.
     *
     * @param id the id of the joinTableAbcXyz to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/join-table-abc-xyzs/{id}")
    public ResponseEntity<Void> deleteJoinTableAbcXyz(@PathVariable Long id) {
        log.debug("REST request to delete JoinTableAbcXyz : {}", id);
        joinTableAbcXyzRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
