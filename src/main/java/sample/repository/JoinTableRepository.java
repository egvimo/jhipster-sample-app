package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.JoinTable;

/**
 * Spring Data SQL repository for the JoinTable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface JoinTableRepository extends JpaRepository<JoinTable, Long> {}
