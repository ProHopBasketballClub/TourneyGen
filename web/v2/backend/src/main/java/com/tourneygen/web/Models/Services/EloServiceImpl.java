package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.Team;
import org.springframework.stereotype.Service;

@Service
public class EloServiceImpl implements EloService {
  public static double ELO_SCALE_CONST = 30.0;
  public static double DIVISOR = 400.0f;

  @Override
  public void updateElos(Team victor, Team loser) {
    // Match.pow(10,X) = 10 ^ X
    double victorScale =
        (1.0 / (1.0 + Math.pow(10, ((loser.getRating() - victor.getRating()) / DIVISOR))));
    double loserScale =
        (1.0 / (1.0 + Math.pow(10, ((victor.getRating() - loser.getRating()) / DIVISOR))));

    int newVictorElo = (int) (victor.getRating() + ELO_SCALE_CONST * (1 - victorScale));
    int newLoserElo = (int) (loser.getRating() + ELO_SCALE_CONST * (0 - loserScale));

    victor.setRating(newVictorElo);
    loser.setRating(newLoserElo);
  }
}
