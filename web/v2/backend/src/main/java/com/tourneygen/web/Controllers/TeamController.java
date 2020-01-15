package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.DTOs.TeamDTO;
import com.tourneygen.web.Models.DTOs.TeamUpdateDTO;
import com.tourneygen.web.Models.Services.TeamService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TeamController {

  private TeamService teamService;

  @Autowired
  public TeamController(TeamService teamService) {
    this.teamService = teamService;
  }

  @GetMapping(value = "/team")
  public List<TeamDTO> getTeams(@RequestParam(name = "id", defaultValue = "-1") long id) {
    return teamService.findTeamList(id);
  }

  @PostMapping(value = "/team")
  public TeamDTO createTeam(@Valid @RequestBody TeamDTO teamDTO) {
    return teamService.createTeam(teamDTO);
  }

  @PutMapping(value = "/team")
  public TeamUpdateDTO updateTeam(@Valid @RequestBody TeamUpdateDTO teamUpdateDTO) {
    return teamService.updateTeam(teamUpdateDTO);
  }

  @DeleteMapping(value = "/team")
  public String deleteTeam(@RequestParam(name = "id") long id) {
    teamService.deleteTeam(id);
    return "Successfully deleted team with id " + id;
  }
}
