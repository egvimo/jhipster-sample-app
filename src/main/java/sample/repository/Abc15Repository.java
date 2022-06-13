package sample.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import sample.domain.Abc15;

/**
 * Spring Data SQL repository for the Abc15 entity.
 */
@SuppressWarnings("unused")
@Repository
public interface Abc15Repository extends JpaRepository<Abc15, Long> {}
