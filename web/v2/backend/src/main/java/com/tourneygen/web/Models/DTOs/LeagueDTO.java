package com.tourneygen.web.Models.DTOs;

import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.Team;
import com.tourneygen.web.Models.Tournament;
import com.tourneygen.web.Models.User;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityExistsException;
import javax.persistence.EntityNotFoundException;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class LeagueDTO {

  private Long id;

  @NotNull private Long owner;

  @Size(min = 1, max = League.MAX_LEAGUE_NAME_SIZE)
  public String name;

  @Size(min = 1)
  private String description;

  @Size(min = 1)
  private String game_type;

  private long[] tournaments = new long[1];

  private long[] teams = new long[1];

  public LeagueDTO(League league) {
    this.owner = league.getOwner().getId();
    this.name = league.name;
    this.game_type = league.game_type;
    List<Long> tournamentId =
        Arrays.stream(league.getTournaments()).map(Tournament::getId).collect(Collectors.toList());
    List<Long> teamId =
        Arrays.stream(league.getTeams()).map(Team::getId).collect(Collectors.toList());
    this.tournaments = tournamentId.stream().mapToLong(l -> l).toArray();
    this.teams = teamId.stream().mapToLong(l -> l).toArray();
  }

  public static List<LeagueDTO> findAll(List<League> leagues) {
    ArrayList<LeagueDTO> list = new ArrayList<>(leagues.size());
    for (League league : leagues) {
      list.add(new LeagueDTO(league));
    }
    return list;
  }

  public User getOwner(UserRepository userRepository) {
    return userRepository
        .findById(owner)
        .orElseThrow(
            () -> new EntityNotFoundException("Owner with id " + owner + " was not found"));
  }

  public void setOwner(User owner) {
    this.owner = owner.getId();
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

  public String getGame_type() {
    return game_type;
  }

  public void setGame_type(String game_type) {
    this.game_type = game_type;
  }

  public long[] getTournaments() {
    return tournaments;
  }

  public void setTournaments(long[] tournaments) {
    this.tournaments = tournaments;
  }

  public long[] getTeams() {
    return teams;
  }

  public void setTeams(long[] teams) {
    this.teams = teams;
  }

  public long getOwner() {
    return owner;
  }

  public LeagueDTO() {}

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }
}
