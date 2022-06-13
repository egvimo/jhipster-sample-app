package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc28;

/**
 * Spring Data SQL repository for the Abc28 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc28Repository extends JpaRepository<Abc28, Long> {}
