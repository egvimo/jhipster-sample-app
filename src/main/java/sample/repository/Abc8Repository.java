package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc8;

/**
 * Spring Data SQL repository for the Abc8 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc8Repository extends JpaRepository<Abc8, Long> {}
