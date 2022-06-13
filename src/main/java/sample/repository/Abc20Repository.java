package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc20;

/**
 * Spring Data SQL repository for the Abc20 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc20Repository extends JpaRepository<Abc20, Long> {}
