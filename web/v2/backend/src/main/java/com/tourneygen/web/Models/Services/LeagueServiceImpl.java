package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.DTOs.LeagueDTO;
import com.tourneygen.web.Models.DTOs.LeagueUpdateDTO;
import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.User;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class LeagueServiceImpl implements LeagueService {

  private LeagueRepository leagueRepository;
  private UserRepository userRepository;

  @Autowired
  public LeagueServiceImpl(LeagueRepository leagueRepository, UserRepository userRepository) {
    this.leagueRepository = leagueRepository;
    this.userRepository = userRepository;
  }

  @Override
  public void deleteLeague(long id) {
    League league =
        leagueRepository
            .findById(id)
            .orElseThrow(
                () -> new EntityNotFoundException("League with id " + id + " was not found"));
    User user = league.getOwner();
    user.getLeagues().remove(league);
    userRepository.save(user);
    leagueRepository.deleteById(league.getId());
  }

  @Override
  public League updateLeague(LeagueUpdateDTO leagueDTO) {
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

  @Override
  public LeagueDTO createLeague(LeagueDTO leagueDTO) {
    League league = new League();
    league.create(leagueDTO, userRepository);
    league = leagueRepository.save(league);
    leagueDTO.setId(league.getId());
    return leagueDTO;
  }

  @Override
  public List<LeagueDTO> findLeagueList(long id) {
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
}
