package com.tourneygen.web.Models.Repositories;

import com.tourneygen.web.Models.League;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface LeagueRepository extends CrudRepository<League, Long> {
  List<League> findAll();

  Optional<League> findById(long id);
}
