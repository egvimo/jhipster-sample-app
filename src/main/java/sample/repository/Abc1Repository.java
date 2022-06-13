package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc1;

/**
 * Spring Data SQL repository for the Abc1 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc1Repository extends JpaRepository<Abc1, Long> {}
