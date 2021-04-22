package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.JoinTableAbcXyz;

/**
 * Spring Data SQL repository for the JoinTableAbcXyz entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JoinTableAbcXyzRepository extends JpaRepository<JoinTableAbcXyz, Long> {}
