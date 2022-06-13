package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc29;

/**
 * Spring Data SQL repository for the Abc29 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc29Repository extends JpaRepository<Abc29, Long> {}
