package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.DTOs.MatchDTO;
import com.tourneygen.web.Models.Services.MatchService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class MatchController {
  private MatchService matchService;

  @Autowired
  public MatchController(MatchService matchService) {
    this.matchService = matchService;
  }

  @GetMapping("/match")
  public List<MatchDTO> getMatch(@RequestParam(name = "id", defaultValue = "-1") long id) {
    return matchService.findMatch(id);
  }

  @PostMapping("/match")
  public MatchDTO createMatch(@RequestBody MatchDTO matchDTO) {
    return matchService.create(matchDTO);
  }

  @DeleteMapping("/match")
  public String deleteMatch(@RequestParam(name = "id") long id) {
    matchService.deleteMatch(id);
    return "Successfully deleted match with id " + id;
  }
}
