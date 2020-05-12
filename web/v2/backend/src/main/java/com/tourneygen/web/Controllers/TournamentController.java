package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.Repositories.TournamentRepository;
import com.tourneygen.web.Models.Tournament;
import java.util.List;
import javax.persistence.EntityExistsException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TournamentController {
  private TournamentRepository tournamentRepository;

  @Autowired
  public TournamentController(TournamentRepository tournamentRepository) {
    this.tournamentRepository = tournamentRepository;
  }

  @GetMapping("tournament/all")
  public List<Tournament> findAll() {
    return tournamentRepository.findAll();
  }

  @GetMapping("tournament/{id}")
  public Tournament findById(@PathVariable("id") long id) {
    return tournamentRepository.findById(id).orElseThrow(EntityExistsException::new);
  }

  @PostMapping("tournament/{id}")
  public Tournament createTournament(@RequestBody Tournament tournament) {
    return tournamentRepository.save(tournament);
  }

  @PutMapping("tournament/{id}")
  public Tournament updateTournament(@RequestBody Tournament tournament) throws Exception {

    // Super bad error handling fix later with more constraints
    if (tournament.getId() == null || tournament.getId() < 0) {
      throw new Exception("Invalid Id");
    }
    return tournamentRepository.save(tournament);
  }

  @DeleteMapping("tournament/{id}")
  public String deleteTournament(@RequestBody Tournament tournament) {
    tournamentRepository.delete(tournament);
    return "Deleted tournament with id " + tournament.getId();
  }
}
