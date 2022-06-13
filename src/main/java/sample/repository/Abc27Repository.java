package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc27;

/**
 * Spring Data SQL repository for the Abc27 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc27Repository extends JpaRepository<Abc27, Long> {}
