package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc23;

/**
 * Spring Data SQL repository for the Abc23 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc23Repository extends JpaRepository<Abc23, Long> {}
