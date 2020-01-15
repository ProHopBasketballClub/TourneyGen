package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.DTOs.LeagueDTO;
import com.tourneygen.web.Models.DTOs.LeagueUpdateDTO;
import com.tourneygen.web.Models.League;
import java.util.List;

public interface LeagueService {
  void deleteLeague(long Id);

  League updateLeague(LeagueUpdateDTO leagueDTO);

  LeagueDTO createLeague(LeagueDTO leagueDTO);

  List<LeagueDTO> findLeagueList(long id);
}
