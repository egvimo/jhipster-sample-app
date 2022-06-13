package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc4;

/**
 * Spring Data SQL repository for the Abc4 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc4Repository extends JpaRepository<Abc4, Long> {}
