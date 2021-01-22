package sample.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sample.domain.Abc;
import sample.service.AbcQueryService;
import sample.service.AbcService;
import sample.service.dto.AbcCriteria;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Abc}.
 */
@RestController
@RequestMapping("/api")
public class AbcResource {

    private final Logger log = LoggerFactory.getLogger(AbcResource.class);

    private static final String ENTITY_NAME = "abc";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AbcService abcService;

    private final AbcQueryService abcQueryService;

    public AbcResource(AbcService abcService, AbcQueryService abcQueryService) {
        this.abcService = abcService;
        this.abcQueryService = abcQueryService;
    }

    /**
     * {@code POST  /abcs} : Create a new abc.
     *
     * @param abc the abc to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new abc, or with status {@code 400 (Bad Request)} if the abc has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/abcs")
    public ResponseEntity<Abc> createAbc(@Valid @RequestBody Abc abc) throws URISyntaxException {
        log.debug("REST request to save Abc : {}", abc);
        if (abc.getId() != null) {
            throw new BadRequestAlertException("A new abc cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Abc result = abcService.save(abc);
        return ResponseEntity
            .created(new URI("/api/abcs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /abcs} : Updates an existing abc.
     *
     * @param abc the abc to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc,
     * or with status {@code 400 (Bad Request)} if the abc is not valid,
     * or with status {@code 500 (Internal Server Error)} if the abc couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/abcs")
    public ResponseEntity<Abc> updateAbc(@Valid @RequestBody Abc abc) throws URISyntaxException {
        log.debug("REST request to update Abc : {}", abc);
        if (abc.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Abc result = abcService.save(abc);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /abcs} : Updates given fields of an existing abc.
     *
     * @param abc the abc to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated abc,
     * or with status {@code 400 (Bad Request)} if the abc is not valid,
     * or with status {@code 404 (Not Found)} if the abc is not found,
     * or with status {@code 500 (Internal Server Error)} if the abc couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/abcs", consumes = "application/merge-patch+json")
    public ResponseEntity<Abc> partialUpdateAbc(@NotNull @RequestBody Abc abc) throws URISyntaxException {
        log.debug("REST request to update Abc partially : {}", abc);
        if (abc.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        Optional<Abc> result = abcService.partialUpdate(abc);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, abc.getId().toString())
        );
    }

    /**
     * {@code GET  /abcs} : get all the abcs.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of abcs in body.
     */
    @GetMapping("/abcs")
    public ResponseEntity<List<Abc>> getAllAbcs(AbcCriteria criteria) {
        log.debug("REST request to get Abcs by criteria: {}", criteria);
        List<Abc> entityList = abcQueryService.findByCriteria(criteria);
        return ResponseEntity.ok().body(entityList);
    }

    /**
     * {@code GET  /abcs/count} : count all the abcs.
     *
     * @param criteria the criteria which the requested entities should match.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the count in body.
     */
    @GetMapping("/abcs/count")
    public ResponseEntity<Long> countAbcs(AbcCriteria criteria) {
        log.debug("REST request to count Abcs by criteria: {}", criteria);
        return ResponseEntity.ok().body(abcQueryService.countByCriteria(criteria));
    }

    /**
     * {@code GET  /abcs/:id} : get the "id" abc.
     *
     * @param id the id of the abc to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the abc, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/abcs/{id}")
    public ResponseEntity<Abc> getAbc(@PathVariable Long id) {
        log.debug("REST request to get Abc : {}", id);
        Optional<Abc> abc = abcService.findOne(id);
        return ResponseUtil.wrapOrNotFound(abc);
    }

    /**
     * {@code DELETE  /abcs/:id} : delete the "id" abc.
     *
     * @param id the id of the abc to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/abcs/{id}")
    public ResponseEntity<Void> deleteAbc(@PathVariable Long id) {
        log.debug("REST request to delete Abc : {}", id);
        abcService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
