package sample.service;

import java.util.List;
import javax.persistence.criteria.JoinType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sample.domain.*; // for static metamodels
import sample.domain.Abc;
import sample.repository.AbcRepository;
import sample.service.dto.AbcCriteria;
import tech.jhipster.service.QueryService;

/**
 * Service for executing complex queries for {@link Abc} entities in the database.
 * The main input is a {@link AbcCriteria} which gets converted to {@link Specification},
 * in a way that all the filters must apply.
 * It returns a {@link List} of {@link Abc} or a {@link Page} of {@link Abc} which fulfills the criteria.
 */
@Service
@Transactional(readOnly = true)
public class AbcQueryService extends QueryService<Abc> {

    private final Logger log = LoggerFactory.getLogger(AbcQueryService.class);

    private final AbcRepository abcRepository;

    public AbcQueryService(AbcRepository abcRepository) {
        this.abcRepository = abcRepository;
    }

    /**
     * Return a {@link List} of {@link Abc} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public List<Abc> findByCriteria(AbcCriteria criteria) {
        log.debug("find by criteria : {}", criteria);
        final Specification<Abc> specification = createSpecification(criteria);
        return abcRepository.findAll(specification);
    }

    /**
     * Return a {@link Page} of {@link Abc} which matches the criteria from the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @param page The page, which should be returned.
     * @return the matching entities.
     */
    @Transactional(readOnly = true)
    public Page<Abc> findByCriteria(AbcCriteria criteria, Pageable page) {
        log.debug("find by criteria : {}, page: {}", criteria, page);
        final Specification<Abc> specification = createSpecification(criteria);
        return abcRepository.findAll(specification, page);
    }

    /**
     * Return the number of matching entities in the database.
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the number of matching entities.
     */
    @Transactional(readOnly = true)
    public long countByCriteria(AbcCriteria criteria) {
        log.debug("count by criteria : {}", criteria);
        final Specification<Abc> specification = createSpecification(criteria);
        return abcRepository.count(specification);
    }

    /**
     * Function to convert {@link AbcCriteria} to a {@link Specification}
     * @param criteria The object which holds all the filters, which the entities should match.
     * @return the matching {@link Specification} of the entity.
     */
    protected Specification<Abc> createSpecification(AbcCriteria criteria) {
        Specification<Abc> specification = Specification.where(null);
        if (criteria != null) {
            if (criteria.getId() != null) {
                specification = specification.and(buildRangeSpecification(criteria.getId(), Abc_.id));
            }
            if (criteria.getName() != null) {
                specification = specification.and(buildStringSpecification(criteria.getName(), Abc_.name));
            }
            if (criteria.getParentId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getParentId(), root -> root.join(Abc_.parent, JoinType.LEFT).get(Abc_.id))
                    );
            }
            if (criteria.getChildrenId() != null) {
                specification =
                    specification.and(
                        buildSpecification(criteria.getChildrenId(), root -> root.join(Abc_.children, JoinType.LEFT).get(Abc_.id))
                    );
            }
        }
        return specification;
    }
}
