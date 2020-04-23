package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.Team;

public interface EloService {

  void updateElos(Team victor, Team loser);
}
