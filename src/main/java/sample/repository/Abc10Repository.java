package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc10;

/**
 * Spring Data SQL repository for the Abc10 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc10Repository extends JpaRepository<Abc10, Long> {}
