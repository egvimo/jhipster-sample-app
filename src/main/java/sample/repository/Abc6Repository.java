package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc6;

/**
 * Spring Data SQL repository for the Abc6 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc6Repository extends JpaRepository<Abc6, Long> {}
