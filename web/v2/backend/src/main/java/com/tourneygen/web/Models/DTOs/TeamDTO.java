package com.tourneygen.web.Models.DTOs;

import com.google.gson.Gson;
import com.tourneygen.web.Models.Team;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class TeamDTO {

  private Long id;

  @NotNull private Set<String> roster;

  private int wins = 0;

  private int losses = 0;

  @NotNull private long owner;

  @NotBlank private String name;

  @NotBlank private String description;

  @NotNull private long league;

  public TeamDTO() {}

  public TeamDTO(Team team) {
    this.id = team.getId();
    this.roster = team.getRoster();
    this.wins = team.getWins();
    this.losses = team.getLosses();
    this.owner = team.getOwner().getId();
    this.name = team.getName();
    this.description = team.getDescription();
    this.league = team.getLeague().getId();
  }

  public static List<TeamDTO> findAll(List<Team> teamList) {
    ArrayList<TeamDTO> teamDTOS = new ArrayList<>();
    for (Team team : teamList) {
      teamDTOS.add(new TeamDTO(team));
    }
    return teamDTOS;
  }

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

  public long getOwner() {
    return owner;
  }

  public void setOwner(long owner) {
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

  public long getLeague() {
    return league;
  }

  public void setLeague(long league) {
    this.league = league;
  }

  public String toJson() {
    return new Gson().toJson(this, TeamDTO.class);
  }

  public static TeamDTO fromJson(String src) {
    return new Gson().fromJson(src, TeamDTO.class);
  }
}
