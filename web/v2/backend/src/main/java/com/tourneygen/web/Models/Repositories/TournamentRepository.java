package com.tourneygen.web.Models.Repositories;

import com.tourneygen.web.Models.Tournament;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface TournamentRepository extends CrudRepository<Tournament, Long> {
  List<Tournament> findAll();

  Optional<Tournament> findById(long id);
}
