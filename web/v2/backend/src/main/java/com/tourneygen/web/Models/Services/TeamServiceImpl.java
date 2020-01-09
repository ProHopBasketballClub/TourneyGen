package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.TeamRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.Team;
import com.tourneygen.web.Models.User;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;

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
}
