package com.tourneygen.web.Models;

import com.tourneygen.web.Models.DTOs.MatchDTO;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.TeamRepository;
import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "Matches")
public class Match {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne @JoinColumn private Team homeTeam;

  @ManyToOne @JoinColumn private Team awayTeam;

  private String title;

  private Date date;

  private @ManyToOne @JoinColumn Team victor;

  private @ManyToOne @JoinColumn Team loser;

  private @ManyToOne @JoinColumn League league;

  private int homeScore = 0;

  private int awayScore = 0;

  // TODO Add tournament field

  private Long updatedBy;

  private String status = "In_Progress";

  public Match() {}

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Team getHomeTeam() {
    return homeTeam;
  }

  public void setHomeTeam(Team homeTeam) {
    this.homeTeam = homeTeam;
  }

  public Team getAwayTeam() {
    return awayTeam;
  }

  public void setAwayTeam(Team awayTeam) {
    this.awayTeam = awayTeam;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public Team getVictor() {
    return victor;
  }

  public void setVictor(Team victor) {
    this.victor = victor;
  }

  public Team getLoser() {
    return loser;
  }

  public void setLoser(Team loser) {
    this.loser = loser;
  }

  public League getLeague() {
    return league;
  }

  public void setLeague(League league) {
    this.league = league;
  }

  public int getHomeScore() {
    return homeScore;
  }

  public void setHomeScore(int homeScore) {
    this.homeScore = homeScore;
  }

  public int getAwayScore() {
    return awayScore;
  }

  public void setAwayScore(int awayScore) {
    this.awayScore = awayScore;
  }

  public Long getUpdatedBy() {
    return updatedBy;
  }

  public void setUpdatedBy(Long updatedBy) {
    this.updatedBy = updatedBy;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public void create(
      MatchDTO matchDTO, LeagueRepository leagueRepository, TeamRepository teamRepository) {
    this.title = matchDTO.getTitle();
    this.date = matchDTO.getDate();
    this.homeTeam =
        teamRepository
            .findById(matchDTO.getHomeId())
            .orElseThrow(
                () -> new EntityNotFoundException("Home Team with id " + id + " was not found"));
    this.awayTeam =
        teamRepository
            .findById(matchDTO.getAwayId())
            .orElseThrow(
                () -> new EntityNotFoundException("Away Team with id " + id + " was not found"));
    this.league =
        leagueRepository
            .findById(matchDTO.getLeagueId())
            .orElseThrow(
                () -> new EntityNotFoundException("League with id " + id + " was not found"));
  }
}
