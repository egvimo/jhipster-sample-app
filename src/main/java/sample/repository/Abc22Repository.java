package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc22;

/**
 * Spring Data SQL repository for the Abc22 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc22Repository extends JpaRepository<Abc22, Long> {}
