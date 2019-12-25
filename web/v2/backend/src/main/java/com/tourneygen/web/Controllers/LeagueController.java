package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.DTOs.LeagueDTO;
import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
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

  @PostMapping(value = "/league")
  public League createLeague(@Valid @RequestBody League league) {
    return leagueRepository.save(league);
  }

  @PutMapping(value = "/league")
  public League updateLeague(@Valid @RequestBody LeagueDTO leagueDTO) {
    League league =
        leagueRepository.findById(leagueDTO.getId()).orElseThrow(EntityNotFoundException::new);
    league.merge(leagueDTO);
    return leagueRepository.save(league);
  }

  @DeleteMapping(value = "/league")
  public String deleteLeague(@RequestParam(name = "id") long id) {
    leagueRepository.deleteById(id);
    return "Successfully Deleted league with id " + id;
  }
}
