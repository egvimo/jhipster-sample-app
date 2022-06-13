package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc24;

/**
 * Spring Data SQL repository for the Abc24 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc24Repository extends JpaRepository<Abc24, Long> {}
