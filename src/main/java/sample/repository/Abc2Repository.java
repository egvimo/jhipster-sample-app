package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc2;

/**
 * Spring Data SQL repository for the Abc2 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc2Repository extends JpaRepository<Abc2, Long> {}
