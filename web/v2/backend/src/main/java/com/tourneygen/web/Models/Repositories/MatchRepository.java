package com.tourneygen.web.Models.Repositories;

import com.tourneygen.web.Models.Match;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface MatchRepository extends CrudRepository<Match, Long> {
  Match findById(long id);

  List<Match> findAll();
}
