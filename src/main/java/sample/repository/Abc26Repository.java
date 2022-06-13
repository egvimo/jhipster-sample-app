package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc26;

/**
 * Spring Data SQL repository for the Abc26 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc26Repository extends JpaRepository<Abc26, Long> {}
