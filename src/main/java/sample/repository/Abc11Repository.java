package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc11;

/**
 * Spring Data SQL repository for the Abc11 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc11Repository extends JpaRepository<Abc11, Long> {}
