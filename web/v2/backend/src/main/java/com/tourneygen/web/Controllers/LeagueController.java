package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.DTOs.LeagueDTO;
import com.tourneygen.web.Models.DTOs.LeagueUpdateDTO;
import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.Services.LeagueService;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class LeagueController {

  private LeagueRepository leagueRepository;
  private UserRepository userRepository;
  private LeagueService leagueService;

  @Autowired
  public LeagueController(
      LeagueRepository leagueRepository,
      UserRepository userRepository,
      LeagueService leagueService) {
    this.leagueRepository = leagueRepository;
    this.userRepository = userRepository;
    this.leagueService = leagueService;
  }

  @GetMapping(value = "/league")
  public List<LeagueDTO> getLeague(@RequestParam(name = "id", defaultValue = "-1") long id) {
    return id < 0
        ? LeagueDTO.findAll(leagueRepository.findAll())
        : Collections.singletonList(
            new LeagueDTO(
                leagueRepository
                    .findById(id)
                    .orElseThrow(
                        () ->
                            new EntityNotFoundException(
                                "League with id " + id + " was not found"))));
  }

  @PostMapping(value = "/league")
  public LeagueDTO createLeague(@RequestBody LeagueDTO leagueDTO) {
    League league = new League();
    league.create(leagueDTO, userRepository);
    league = leagueRepository.save(league);
    leagueDTO.setId(league.getId());
    return leagueDTO;
  }

  @PutMapping(value = "/league")
  public League updateLeague(@Valid @RequestBody LeagueUpdateDTO leagueDTO) {
    League league =
        leagueRepository
            .findById(leagueDTO.getId())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "League with id " + leagueDTO.getId() + " was not found"));
    league.merge(leagueDTO, userRepository);
    return leagueRepository.save(league);
  }

  @DeleteMapping(value = "/league")
  public String deleteLeague(@RequestParam(name = "id") long id) {
    leagueService.deleteLeague(id);
    return "Successfully Deleted league with id " + id;
  }
}
