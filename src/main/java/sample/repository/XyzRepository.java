package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Xyz;

/**
 * Spring Data SQL repository for the Xyz entity.
 */
@SuppressWarnings("unused")
@Repository
public interface XyzRepository extends JpaRepository<Xyz, Long> {}
