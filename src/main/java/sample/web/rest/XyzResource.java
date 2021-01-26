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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import sample.domain.Xyz;
import sample.repository.XyzRepository;
import sample.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link sample.domain.Xyz}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class XyzResource {

    private final Logger log = LoggerFactory.getLogger(XyzResource.class);

    private static final String ENTITY_NAME = "xyz";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final XyzRepository xyzRepository;

    public XyzResource(XyzRepository xyzRepository) {
        this.xyzRepository = xyzRepository;
    }

    /**
     * {@code POST  /xyzs} : Create a new xyz.
     *
     * @param xyz the xyz to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new xyz, or with status {@code 400 (Bad Request)} if the xyz has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/xyzs")
    public ResponseEntity<Xyz> createXyz(@Valid @RequestBody Xyz xyz) throws URISyntaxException {
        log.debug("REST request to save Xyz : {}", xyz);
        if (xyz.getId() != null) {
            throw new BadRequestAlertException("A new xyz cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Xyz result = xyzRepository.save(xyz);
        return ResponseEntity
            .created(new URI("/api/xyzs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /xyzs} : Updates an existing xyz.
     *
     * @param xyz the xyz to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated xyz,
     * or with status {@code 400 (Bad Request)} if the xyz is not valid,
     * or with status {@code 500 (Internal Server Error)} if the xyz couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/xyzs")
    public ResponseEntity<Xyz> updateXyz(@Valid @RequestBody Xyz xyz) throws URISyntaxException {
        log.debug("REST request to update Xyz : {}", xyz);
        if (xyz.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        Xyz result = xyzRepository.save(xyz);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, xyz.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /xyzs} : Updates given fields of an existing xyz.
     *
     * @param xyz the xyz to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated xyz,
     * or with status {@code 400 (Bad Request)} if the xyz is not valid,
     * or with status {@code 404 (Not Found)} if the xyz is not found,
     * or with status {@code 500 (Internal Server Error)} if the xyz couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/xyzs", consumes = "application/merge-patch+json")
    public ResponseEntity<Xyz> partialUpdateXyz(@NotNull @RequestBody Xyz xyz) throws URISyntaxException {
        log.debug("REST request to update Xyz partially : {}", xyz);
        if (xyz.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        Optional<Xyz> result = xyzRepository
            .findById(xyz.getId())
            .map(
                existingXyz -> {
                    if (xyz.getName() != null) {
                        existingXyz.setName(xyz.getName());
                    }

                    return existingXyz;
                }
            )
            .map(xyzRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, xyz.getId().toString())
        );
    }

    /**
     * {@code GET  /xyzs} : get all the xyzs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of xyzs in body.
     */
    @GetMapping("/xyzs")
    public List<Xyz> getAllXyzs() {
        log.debug("REST request to get all Xyzs");
        return xyzRepository.findAll();
    }

    /**
     * {@code GET  /xyzs/:id} : get the "id" xyz.
     *
     * @param id the id of the xyz to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the xyz, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/xyzs/{id}")
    public ResponseEntity<Xyz> getXyz(@PathVariable Long id) {
        log.debug("REST request to get Xyz : {}", id);
        Optional<Xyz> xyz = xyzRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(xyz);
    }

    /**
     * {@code DELETE  /xyzs/:id} : delete the "id" xyz.
     *
     * @param id the id of the xyz to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/xyzs/{id}")
    public ResponseEntity<Void> deleteXyz(@PathVariable Long id) {
        log.debug("REST request to delete Xyz : {}", id);
        xyzRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
