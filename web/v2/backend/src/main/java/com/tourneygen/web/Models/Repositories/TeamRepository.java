package com.tourneygen.web.Models.Repositories;

import com.tourneygen.web.Models.Team;
import java.util.List;
import org.springframework.data.repository.CrudRepository;

public interface TeamRepository extends CrudRepository<Team, Long> {
  List<Team> findAll();

  Team findById(long id);
}
