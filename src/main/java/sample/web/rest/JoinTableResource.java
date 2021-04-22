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
import sample.domain.JoinTable;
import sample.repository.JoinTableRepository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.JoinTable}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class JoinTableResource {

    private final Logger log = LoggerFactory.getLogger(JoinTableResource.class);

    private static final String ENTITY_NAME = "joinTable";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final JoinTableRepository joinTableRepository;

    public JoinTableResource(JoinTableRepository joinTableRepository) {
        this.joinTableRepository = joinTableRepository;
    }

    /**
     * {@code POST  /join-tables} : Create a new joinTable.
     *
     * @param joinTable the joinTable to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new joinTable, or with status {@code 400 (Bad Request)} if the joinTable has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/join-tables")
    public ResponseEntity<JoinTable> createJoinTable(@Valid @RequestBody JoinTable joinTable) throws URISyntaxException {
        log.debug("REST request to save JoinTable : {}", joinTable);
        if (joinTable.getId() != null) {
            throw new BadRequestAlertException("A new joinTable cannot already have an ID", ENTITY_NAME, "idexists");
        }
        JoinTable result = joinTableRepository.save(joinTable);
        return ResponseEntity
            .created(new URI("/api/join-tables/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /join-tables/:id} : Updates an existing joinTable.
     *
     * @param id the id of the joinTable to save.
     * @param joinTable the joinTable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated joinTable,
     * or with status {@code 400 (Bad Request)} if the joinTable is not valid,
     * or with status {@code 500 (Internal Server Error)} if the joinTable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/join-tables/{id}")
    public ResponseEntity<JoinTable> updateJoinTable(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody JoinTable joinTable
    ) throws URISyntaxException {
        log.debug("REST request to update JoinTable : {}, {}", id, joinTable);
        if (joinTable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, joinTable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!joinTableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        JoinTable result = joinTableRepository.save(joinTable);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, joinTable.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /join-tables/:id} : Partial updates given fields of an existing joinTable, field will ignore if it is null
     *
     * @param id the id of the joinTable to save.
     * @param joinTable the joinTable to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated joinTable,
     * or with status {@code 400 (Bad Request)} if the joinTable is not valid,
     * or with status {@code 404 (Not Found)} if the joinTable is not found,
     * or with status {@code 500 (Internal Server Error)} if the joinTable couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/join-tables/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<JoinTable> partialUpdateJoinTable(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody JoinTable joinTable
    ) throws URISyntaxException {
        log.debug("REST request to partial update JoinTable partially : {}, {}", id, joinTable);
        if (joinTable.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, joinTable.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!joinTableRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<JoinTable> result = joinTableRepository
            .findById(joinTable.getId())
            .map(
                existingJoinTable -> {
                    if (joinTable.getAdditionalColumn() != null) {
                        existingJoinTable.setAdditionalColumn(joinTable.getAdditionalColumn());
                    }

                    return existingJoinTable;
                }
            )
            .map(joinTableRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, joinTable.getId().toString())
        );
    }

    /**
     * {@code GET  /join-tables} : get all the joinTables.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of joinTables in body.
     */
    @GetMapping("/join-tables")
    public List<JoinTable> getAllJoinTables() {
        log.debug("REST request to get all JoinTables");
        return joinTableRepository.findAll();
    }

    /**
     * {@code GET  /join-tables/:id} : get the "id" joinTable.
     *
     * @param id the id of the joinTable to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the joinTable, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/join-tables/{id}")
    public ResponseEntity<JoinTable> getJoinTable(@PathVariable Long id) {
        log.debug("REST request to get JoinTable : {}", id);
        Optional<JoinTable> joinTable = joinTableRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(joinTable);
    }

    /**
     * {@code DELETE  /join-tables/:id} : delete the "id" joinTable.
     *
     * @param id the id of the joinTable to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/join-tables/{id}")
    public ResponseEntity<Void> deleteJoinTable(@PathVariable Long id) {
        log.debug("REST request to delete JoinTable : {}", id);
        joinTableRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
