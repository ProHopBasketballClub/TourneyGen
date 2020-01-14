package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.DTOs.TeamDTO;
import com.tourneygen.web.Models.DTOs.TeamUpdateDTO;
import com.tourneygen.web.Models.Team;

import java.util.List;

public interface TeamService {
  void deleteTeam(long team);

  TeamUpdateDTO updateTeam(TeamUpdateDTO teamUpdateDTO);

  List<TeamDTO> findTeamList(long id);

  TeamDTO createTeam(TeamDTO teamDTO);

}
