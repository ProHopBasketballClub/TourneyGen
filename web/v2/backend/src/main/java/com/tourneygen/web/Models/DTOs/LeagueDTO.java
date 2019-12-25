package com.tourneygen.web.Models.DTOs;

import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Team;
import com.tourneygen.web.Models.Tournament;
import com.tourneygen.web.Models.User;

import javax.persistence.ManyToOne;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class LeagueDTO {

  @NotNull private Long id;

  @ManyToOne private User owner;

  @Size(min = 1, max = League.MAX_LEAGUE_NAME_SIZE)
  public String name;

  @Size(min = 1)
  private String description;

  @Size(min = 1)
  private String game_type;

  private Tournament[] tournaments;

  private Team[] teams;

  public User getOwner() {
    return owner;
  }

  public void setOwner(User owner) {
    this.owner = owner;
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

  public Tournament[] getTournaments() {
    return tournaments;
  }

  public void setTournaments(Tournament[] tournaments) {
    this.tournaments = tournaments;
  }

  public Team[] getTeams() {
    return teams;
  }

  public void setTeams(Team[] teams) {
    this.teams = teams;
  }

  public LeagueDTO() {}

  public Long getId() {
    return id;
  }
}
