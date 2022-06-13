package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc3;

/**
 * Spring Data SQL repository for the Abc3 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc3Repository extends JpaRepository<Abc3, Long> {}
