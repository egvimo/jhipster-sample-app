package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc17;

/**
 * Spring Data SQL repository for the Abc17 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc17Repository extends JpaRepository<Abc17, Long> {}
