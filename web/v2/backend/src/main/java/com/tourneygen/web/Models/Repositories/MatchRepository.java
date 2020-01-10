package com.tourneygen.web.Models.Repositories;

import com.tourneygen.web.Models.Match;
import org.springframework.data.repository.CrudRepository;

public interface MatchRepository extends CrudRepository<Match, Long> {
  Match findById(long id);
}
