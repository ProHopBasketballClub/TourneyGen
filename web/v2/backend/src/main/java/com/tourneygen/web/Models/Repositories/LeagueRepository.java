package com.tourneygen.web.Models.Repositories;

import com.tourneygen.web.Models.League;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface LeagueRepository extends CrudRepository<League, Long> {
  List<League> findAll();

  Optional<League> findById(long id);
}
