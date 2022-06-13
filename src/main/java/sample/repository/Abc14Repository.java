package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc14;

/**
 * Spring Data SQL repository for the Abc14 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc14Repository extends JpaRepository<Abc14, Long> {}
