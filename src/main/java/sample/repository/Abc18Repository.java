package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc18;

/**
 * Spring Data SQL repository for the Abc18 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc18Repository extends JpaRepository<Abc18, Long> {}
