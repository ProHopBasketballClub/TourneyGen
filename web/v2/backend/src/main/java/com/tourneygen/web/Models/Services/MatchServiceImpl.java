package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.DTOs.MatchDTO;
import com.tourneygen.web.Models.Match;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.MatchRepository;
import com.tourneygen.web.Models.Repositories.TeamRepository;
import java.util.Collections;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MatchServiceImpl implements MatchService {

  private MatchRepository matchRepository;
  private LeagueRepository leagueRepository;
  private TeamRepository teamRepository;

  @Autowired
  public MatchServiceImpl(
      MatchRepository matchRepository,
      LeagueRepository leagueRepository,
      TeamRepository teamRepository) {
    this.leagueRepository = leagueRepository;
    this.matchRepository = matchRepository;
    this.teamRepository = teamRepository;
  }

  @Override
  public MatchDTO create(MatchDTO matchDTO) {
    Match match = new Match();
    match.create(matchDTO, leagueRepository, teamRepository);
    match = matchRepository.save(match);
    matchDTO.setId(match.getId());
    return matchDTO;
  }

  @Override
  public List<MatchDTO> findMatch(long id) {
    return id < 0
        ? MatchDTO.findAll(matchRepository.findAll())
        : Collections.singletonList(new MatchDTO(matchRepository.findById(id)));
  }

  @Override
  public void deleteMatch(long id) {}
}
