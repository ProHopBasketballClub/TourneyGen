package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.DTOs.TeamDTO;
import com.tourneygen.web.Models.DTOs.TeamUpdateDTO;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.MatchRepository;
import com.tourneygen.web.Models.Repositories.TeamRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.Services.TeamService;
import com.tourneygen.web.Models.Team;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TeamController {

  private UserRepository userRepository;

  private TeamRepository teamRepository;

  private MatchRepository matchRepository;

  private LeagueRepository leagueRepository;

  private TeamService teamService;

  @Autowired
  public TeamController(
      UserRepository userRepository,
      TeamRepository teamRepository,
      MatchRepository matchRepository,
      LeagueRepository leagueRepository,
      TeamService teamService) {
    this.userRepository = userRepository;
    this.teamRepository = teamRepository;
    this.matchRepository = matchRepository;
    this.leagueRepository = leagueRepository;
    this.teamService = teamService;
  }

  @GetMapping(value = "/team")
  public List<TeamDTO> getTeams(@RequestParam(name = "id", defaultValue = "-1") long id) {
    return id < 0
        ? TeamDTO.findAll(teamRepository.findAll())
        : Collections.singletonList(
            new TeamDTO(
                teamRepository
                    .findById(id)
                    .orElseThrow(
                        () ->
                            new EntityNotFoundException("Team with id " + id + " was not found"))));
  }

  @PostMapping(value = "/team")
  public TeamDTO createTeam(@Valid @RequestBody TeamDTO teamDTO) {
    Team team = new Team();
    team.create(teamDTO, userRepository, leagueRepository);
    return new TeamDTO(teamRepository.save(team));
  }

  @PutMapping(value = "/team")
  public TeamUpdateDTO updateTeam(@Valid @RequestBody TeamUpdateDTO teamUpdateDTO) {
    Team team =
        teamRepository
            .findById(teamUpdateDTO.getId())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "Team with id " + teamUpdateDTO.getId() + " was not found"));
    team.merge(teamUpdateDTO, userRepository, leagueRepository);
    return new TeamUpdateDTO(teamRepository.save(team));
  }

  @DeleteMapping(value = "/team")
  public String deleteTeam(@RequestParam(name = "id") long id) {
    teamService.deleteTeam(id);
    return "Successfully deleted team with id " + id;
  }
}
