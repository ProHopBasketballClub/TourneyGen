package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.DTOs.LeagueDTO;
import com.tourneygen.web.Models.DTOs.LeagueUpdateDTO;
import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Services.LeagueService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class LeagueController {

  private LeagueService leagueService;

  @Autowired
  public LeagueController(LeagueService leagueService) {
    this.leagueService = leagueService;
  }

  @GetMapping(value = "/league")
  public List<LeagueDTO> getLeague(@RequestParam(name = "id", defaultValue = "-1") long id) {
    return leagueService.findLeagueList(id);
  }

  @PostMapping(value = "/league")
  public LeagueDTO createLeague(@RequestBody LeagueDTO leagueDTO) {
    return leagueService.createLeague(leagueDTO);
  }

  @PutMapping(value = "/league")
  public League updateLeague(@Valid @RequestBody LeagueUpdateDTO leagueDTO) {
    return leagueService.updateLeague(leagueDTO);
  }

  @DeleteMapping(value = "/league")
  public String deleteLeague(@RequestParam(name = "id") long id) {
    leagueService.deleteLeague(id);
    return "Successfully Deleted league with id " + id;
  }
}
