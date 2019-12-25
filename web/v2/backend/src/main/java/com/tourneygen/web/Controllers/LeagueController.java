package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.EntityNotFoundException;
import java.util.Collections;
import java.util.List;

@RestController
public class LeagueController {

  private LeagueRepository leagueRepository;

  @Autowired
  public LeagueController(LeagueRepository leagueRepository) {
    this.leagueRepository = leagueRepository;
  }

  @GetMapping(value = "/league")
  public List<League> getLeague(@RequestParam(name = "id", defaultValue = "-1") long id) {
    return id < 0
        ? leagueRepository.findAll()
        : Collections.singletonList(
            leagueRepository.findById(id).orElseThrow(EntityNotFoundException::new));
  }
}
