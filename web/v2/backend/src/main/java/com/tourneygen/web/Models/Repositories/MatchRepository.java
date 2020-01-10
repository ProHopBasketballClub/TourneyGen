package com.tourneygen.web.Models.Repositories;

import com.tourneygen.web.Models.Match;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface MatchRepository extends CrudRepository<Match, Long> {
  Match findById(long id);

  List<Match> findAll();
}
