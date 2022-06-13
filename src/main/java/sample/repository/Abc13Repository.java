package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc13;

/**
 * Spring Data SQL repository for the Abc13 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc13Repository extends JpaRepository<Abc13, Long> {}
