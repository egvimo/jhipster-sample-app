package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc25;

/**
 * Spring Data SQL repository for the Abc25 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc25Repository extends JpaRepository<Abc25, Long> {}
