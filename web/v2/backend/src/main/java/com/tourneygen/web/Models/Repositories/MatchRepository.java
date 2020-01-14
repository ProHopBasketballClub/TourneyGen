package com.tourneygen.web.Models.Repositories;

import com.tourneygen.web.Models.Match;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface MatchRepository extends CrudRepository<Match, Long> {
  Optional<Match> findById(long id);

  List<Match> findAll();
}
