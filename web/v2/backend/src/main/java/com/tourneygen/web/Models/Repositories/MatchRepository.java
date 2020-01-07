package com.tourneygen.web.Models.Repositories;

import com.tourneygen.web.Models.Team;
import org.springframework.data.repository.CrudRepository;

public interface MatchRepository extends CrudRepository<Team, Long> {}
