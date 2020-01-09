package com.tourneygen.web.Models.DTOs;

import com.google.gson.Gson;
import com.tourneygen.web.Models.Team;
import java.util.Set;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class TeamUpdateDTO {

  @NotNull private Long id;

  private Set<String> roster;

  @Min(value = 0) private int wins = 0;

  @Min(value = 0) private int losses = 0;

  private Long owner;

  @Size private String name;

  @Size private String description;

  private Long league;

  private float rating;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Set<String> getRoster() {
    return roster;
  }

  public void setRoster(Set<String> roster) {
    this.roster = roster;
  }

  public int getWins() {
    return wins;
  }

  public void setWins(int wins) {
    this.wins = wins;
  }

  public int getLosses() {
    return losses;
  }

  public void setLosses(int losses) {
    this.losses = losses;
  }

  public Long getOwner() {
    return owner;
  }

  public void setOwner(Long owner) {
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

  public Long getLeague() {
    return league;
  }

  public void setLeague(Long league) {
    this.league = league;
  }

  public String toJson() {
    return new Gson().toJson(this, TeamUpdateDTO.class);
  }

  public TeamUpdateDTO fromJson(String src) {
    return new Gson().fromJson(src, TeamUpdateDTO.class);
  }

  public TeamUpdateDTO() {}

  public TeamUpdateDTO(Team team) {
    this.id = team.getId();
    this.description = team.getDescription();
    this.league = team.getLeague().getId();
    this.name = team.getName();
    this.roster = team.getRoster();
    this.losses = team.getLosses();
    this.wins = team.getWins();
    this.rating = team.getRating();
  }
}
