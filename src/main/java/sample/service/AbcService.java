package sample.service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sample.domain.Abc;
import sample.repository.AbcRepository;

/**
 * Service Implementation for managing {@link Abc}.
 */
@Service
@Transactional
public class AbcService {

    private final Logger log = LoggerFactory.getLogger(AbcService.class);

    private final AbcRepository abcRepository;

    public AbcService(AbcRepository abcRepository) {
        this.abcRepository = abcRepository;
    }

    /**
     * Save a abc.
     *
     * @param abc the entity to save.
     * @return the persisted entity.
     */
    public Abc save(Abc abc) {
        log.debug("Request to save Abc : {}", abc);
        return abcRepository.save(abc);
    }

    /**
     * Partially update a abc.
     *
     * @param abc the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<Abc> partialUpdate(Abc abc) {
        log.debug("Request to partially update Abc : {}", abc);

        return abcRepository
            .findById(abc.getId())
            .map(
                existingAbc -> {
                    if (abc.getName() != null) {
                        existingAbc.setName(abc.getName());
                    }

                    return existingAbc;
                }
            )
            .map(abcRepository::save);
    }

    /**
     * Get all the abcs.
     *
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public List<Abc> findAll() {
        log.debug("Request to get all Abcs");
        return abcRepository.findAll();
    }

    /**
     * Get one abc by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<Abc> findOne(Long id) {
        log.debug("Request to get Abc : {}", id);
        return abcRepository.findById(id);
    }

    /**
     * Delete the abc by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        log.debug("Request to delete Abc : {}", id);
        abcRepository.deleteById(id);
    }
}
