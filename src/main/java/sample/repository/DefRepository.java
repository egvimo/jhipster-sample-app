package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Def;

/**
 * Spring Data SQL repository for the Def entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DefRepository extends JpaRepository<Def, Long> {}
