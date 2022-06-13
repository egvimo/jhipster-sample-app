package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc12;

/**
 * Spring Data SQL repository for the Abc12 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc12Repository extends JpaRepository<Abc12, Long> {}
