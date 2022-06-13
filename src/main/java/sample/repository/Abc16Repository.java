package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc16;

/**
 * Spring Data SQL repository for the Abc16 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc16Repository extends JpaRepository<Abc16, Long> {}
