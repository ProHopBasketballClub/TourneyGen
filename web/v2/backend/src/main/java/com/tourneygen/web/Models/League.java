package com.tourneygen.web.Models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class League {
  public static final int MAX_LEAGUE_NAME_SIZE = 50;

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne @NotNull private User owner;

  @Size(min = 1, max = MAX_LEAGUE_NAME_SIZE)
  public String name;

  @Size(min = 1)
  public String description;

  @Size(min = 1)
  public String game_type;

  @ManyToOne public Tournament[] tournaments;

  @ManyToOne public Team[] teams;

  public League() {}

  public Team[] getTeams() {
    return teams;
  }

  public void setTeams(Team[] teams) {
    this.teams = teams;
  }

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

  public Long getId() {
    return id;
  }
}
