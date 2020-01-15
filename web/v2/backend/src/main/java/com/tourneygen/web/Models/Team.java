package com.tourneygen.web.Models;

import com.tourneygen.web.Models.DTOs.TeamDTO;
import com.tourneygen.web.Models.DTOs.TeamUpdateDTO;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Services.EloService;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Entity(name = "Team")
public class Team {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ElementCollection(targetClass = String.class, fetch = FetchType.EAGER)
  private Set<String> roster = new HashSet<>();

  @Min(value = 0, message = "wins must be positive")
  private int wins = 0;

  @Min(value = 0, message = "wins must be positive")
  private int losses = 0;

  @NotNull private int rating = EloService.ELO_INITIAL_VALUE;

  @ManyToOne @JoinColumn private User owner;

  @NotBlank private String name;

  @NotBlank private String description;

  @ManyToOne @JoinColumn @NotNull League league;

  public Set<Match> getHomeMatches() {
    return homeMatches;
  }

  public void setHomeMatches(Set<Match> homeMatches) {
    this.homeMatches = homeMatches;
  }

  public Set<Match> getAwayMatches() {
    return awayMatches;
  }

  public void setAwayMatches(Set<Match> awayMatches) {
    this.awayMatches = awayMatches;
  }

  @OneToMany(mappedBy = "homeTeam", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  Set<Match> homeMatches = new HashSet<>();

  @OneToMany(mappedBy = "awayTeam", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  Set<Match> awayMatches = new HashSet<>();

  public Team() {}

  public Set<String> getRoster() {
    return roster;
  }

  public void setRoster(Set<String> roster) {
    this.roster = roster;
  }

  public void addToRoster(String player) {
    this.roster.add(player);
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

  public int getRating() {
    return rating;
  }

  public void setRating(int rating) {
    this.rating = rating;
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

  public League getLeague() {
    return league;
  }

  public void setLeague(League league) {
    this.league = league;
  }

  public Long getId() {
    return id;
  }

  public void create(
      TeamDTO teamDTO, UserRepository userRepository, LeagueRepository leagueRepository) {
    this.name = teamDTO.getName();
    this.roster = teamDTO.getRoster();
    this.description = teamDTO.getDescription();
    this.league =
        leagueRepository
            .findById(teamDTO.getLeague())
            .orElseThrow(
                () -> new EntityNotFoundException("League with id " + id + " was not found"));
    this.owner =
        userRepository
            .findById(teamDTO.getOwner())
            .orElseThrow(
                () -> new EntityNotFoundException("User with id " + id + " was not found"));
  }

  public void merge(
      TeamUpdateDTO teamUpdateDTO,
      UserRepository userRepository,
      LeagueRepository leagueRepository) {
    this.name = teamUpdateDTO.getName() == null ? this.name : teamUpdateDTO.getName();
    this.owner =
        teamUpdateDTO.getOwner() == null
            ? this.owner
            : userRepository
                .findById(teamUpdateDTO.getOwner())
                .orElseThrow(
                    () -> new EntityNotFoundException("User with id " + id + " was not found"));
    this.description =
        teamUpdateDTO.getDescription() == null ? this.description : teamUpdateDTO.getDescription();
    this.league =
        teamUpdateDTO.getLeague() == null
            ? this.league
            : leagueRepository
                .findById(teamUpdateDTO.getLeague())
                .orElseThrow(
                    () -> new EntityNotFoundException("League with id " + id + " was not found"));
    this.roster = teamUpdateDTO.getRoster() == null ? this.roster : teamUpdateDTO.getRoster();
  }

  @Override
  public boolean equals(Object o) {
    if (o == this) {
      return true;
    }
    if (!(o instanceof Team)) {
      return false;
    }
    Team team = (Team) o;
    return this.id.equals(team.getId());
  }
}
