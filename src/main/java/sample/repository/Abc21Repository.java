package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc21;

/**
 * Spring Data SQL repository for the Abc21 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc21Repository extends JpaRepository<Abc21, Long> {}
