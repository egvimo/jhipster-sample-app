package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc9;

/**
 * Spring Data SQL repository for the Abc9 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc9Repository extends JpaRepository<Abc9, Long> {}
