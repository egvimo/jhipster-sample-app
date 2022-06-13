package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc5;

/**
 * Spring Data SQL repository for the Abc5 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc5Repository extends JpaRepository<Abc5, Long> {}
