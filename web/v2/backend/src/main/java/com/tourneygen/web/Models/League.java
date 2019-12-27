package com.tourneygen.web.Models;

import com.google.gson.Gson;
import com.tourneygen.web.Models.DTOs.LeagueDTO;
import com.tourneygen.web.Models.DTOs.LeagueUpdateDTO;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import org.hibernate.validator.internal.constraintvalidators.bv.time.futureorpresent.AbstractFutureOrPresentInstantBasedValidator;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
public class League {
  public static final int MAX_LEAGUE_NAME_SIZE = 50;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne @NotNull private User owner;

  @Size(min = 1, max = MAX_LEAGUE_NAME_SIZE)
  private String name;

  @Size(min = 1)
  private String description;

  @Size(min = 1)
  private String game_type;

  @ManyToOne private Tournament[] tournaments;

  @ManyToOne private Team[] teams;

  public League() {}

  public League(String name, User owner, String game_type, String description) {
    this.name = name;
    this.owner = owner;
    this.game_type = game_type;
    this.description = description;
  }

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

  public void merge(LeagueUpdateDTO leagueUpdateDTO, UserRepository userRepository) {
    this.owner =
        leagueUpdateDTO.getOwner() == null
            ? this.owner
            : userRepository
                .findById(leagueUpdateDTO.getOwner())
                .orElseThrow(
                    () -> new EntityNotFoundException("User with id " + id + " was not found"));

    this.name = leagueUpdateDTO.getName() == null ? this.name : leagueUpdateDTO.getName();
    this.description =
        leagueUpdateDTO.getDescription() == null
            ? this.description
            : leagueUpdateDTO.getDescription();
    this.game_type =
        leagueUpdateDTO.getGame_type() == null ? this.game_type : leagueUpdateDTO.getGame_type();

    // TODO Update Teams and Tournaments here after they are created
  }

  public void create(LeagueDTO leagueDTO, UserRepository userRepository) {
    this.owner = leagueDTO.getOwner(userRepository);
    this.game_type = leagueDTO.getGame_type();
    this.description = leagueDTO.getDescription();
    this.name = leagueDTO.getName();
    // TODO Update Teams and Tournaments here after they are created
  }

  public String toJson() {
    return new Gson().toJson(this, League.class);
  }

  public static League fromJson(String src) {
    return new Gson().fromJson(src, League.class);
  }
}
