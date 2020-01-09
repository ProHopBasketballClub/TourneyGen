package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;

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
}
