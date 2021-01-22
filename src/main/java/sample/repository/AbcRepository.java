package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc;

/**
 * Spring Data SQL repository for the Abc entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AbcRepository extends JpaRepository<Abc, Long>, JpaSpecificationExecutor<Abc> {}
