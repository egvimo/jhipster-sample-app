package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc7;

/**
 * Spring Data SQL repository for the Abc7 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc7Repository extends JpaRepository<Abc7, Long> {}
