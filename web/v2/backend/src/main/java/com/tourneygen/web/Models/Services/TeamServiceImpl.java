package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.DTOs.TeamDTO;
import com.tourneygen.web.Models.DTOs.TeamUpdateDTO;
import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.TeamRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.Team;
import com.tourneygen.web.Models.User;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class TeamServiceImpl implements TeamService {
  private TeamRepository teamRepository;
  private LeagueRepository leagueRepository;
  private UserRepository userRepository;

  public TeamServiceImpl(
      TeamRepository teamRepository,
      LeagueRepository leagueRepository,
      UserRepository userRepository) {
    this.leagueRepository = leagueRepository;
    this.teamRepository = teamRepository;
    this.userRepository = userRepository;
  }

  @Override
  public void deleteTeam(long id) {
    Team team =
        teamRepository
            .findById(id)
            .orElseThrow(
                () -> new EntityNotFoundException("Team with id " + id + " was not found"));
    User user = team.getOwner();
    League league = team.getLeague();
    user.getTeams().remove(team);
    league.getTeams().remove(team);
    userRepository.save(user);
    leagueRepository.save(league);
    teamRepository.deleteById(team.getId());
  }

  @Override
  public TeamUpdateDTO updateTeam(TeamUpdateDTO teamUpdateDTO) {
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

  @Override
  public List<TeamDTO> findTeamList(long id) {
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

  @Override
  public TeamDTO createTeam(TeamDTO teamDTO) {
    Team team = new Team();
    team.create(teamDTO, userRepository, leagueRepository);
    return new TeamDTO(teamRepository.save(team));
  }

}
