package com.tourneygen.web.Models.DTOs;

import com.google.gson.Gson;
import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Team;
import com.tourneygen.web.Models.Tournament;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class LeagueUpdateDTO {

  @NotNull private long id;

  @Size(min = 1, max = League.MAX_LEAGUE_NAME_SIZE)
  private String name;

  private Long owner;

  @Size(min = 1)
  private String description;

  @Size(min = 1)
  private String game_type;

  private Long[] teams = new Long[1];

  private Long[] tournaments = new Long[1];

  public LeagueUpdateDTO() {}

  public LeagueUpdateDTO(League league) {
    this.id = league.getId();
    this.owner = league.getOwner().getId();
    this.name = league.getName();
    this.game_type = league.getGame_type();
    this.description = league.getDescription();
    if (league.getTournaments() != null) {
      List<Long> tournamentId =
          Arrays.stream(league.getTournaments())
              .map(Tournament::getId)
              .collect(Collectors.toList());
      this.tournaments = tournamentId.toArray(this.tournaments);
    }
    if (league.getTeams() != null) {
      List<Long> teamId = league.getTeams().stream().map(Team::getId).collect(Collectors.toList());
    }
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getGame_type() {
    return game_type;
  }

  public void setGame_type(String game_type) {
    this.game_type = game_type;
  }

  public long getId() {
    return id;
  }

  public Long getOwner() {
    return owner;
  }

  public void setOwner(long owner) {
    this.owner = owner;
  }

  public Long[] getTournaments() {
    return tournaments;
  }

  public void setTournaments(Long[] tournaments) {
    this.tournaments = tournaments;
  }

  public Long[] getTeams() {
    return teams;
  }

  public void setTeams(Long[] teams) {
    this.teams = teams;
  }

  public String toJson() {
    return new Gson().toJson(this, LeagueUpdateDTO.class);
  }
}
