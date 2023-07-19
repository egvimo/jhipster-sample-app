package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc0;

/**
 * Spring Data JPA repository for the Abc0 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc0Repository extends JpaRepository<Abc0, Long> {}
