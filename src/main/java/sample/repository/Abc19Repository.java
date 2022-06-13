package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc19;

/**
 * Spring Data SQL repository for the Abc19 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc19Repository extends JpaRepository<Abc19, Long> {}
