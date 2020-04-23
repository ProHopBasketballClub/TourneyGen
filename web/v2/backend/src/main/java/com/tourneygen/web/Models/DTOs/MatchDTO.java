package com.tourneygen.web.Models.DTOs;

import com.google.gson.Gson;
import com.tourneygen.web.Models.Match;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class MatchDTO {

  private Long id;

  @NotNull private Long homeId;

  @NotNull private Long awayId;

  @NotNull private Long leagueId;

  @Size private String title;

  // TODO implement this in the frontend
  private Date date;

  public MatchDTO() {}

  public MatchDTO(Match match) {
    this.id = match.getId();
    this.awayId = match.getAwayTeam().getId();
    this.homeId = match.getHomeTeam().getId();
    this.leagueId = match.getLeague().getId();
    this.title = match.getTitle();
  }

  public static List<MatchDTO> findAll(Iterable<Match> matchList) {
    List<MatchDTO> matchDTOS = new ArrayList<>();
    for (Match match : matchList) {
      matchDTOS.add(new MatchDTO(match));
    }
    return matchDTOS;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Long getHomeId() {
    return homeId;
  }

  public void setHomeId(Long homeId) {
    this.homeId = homeId;
  }

  public Long getAwayId() {
    return awayId;
  }

  public void setAwayId(Long awayId) {
    this.awayId = awayId;
  }

  public Long getLeagueId() {
    return leagueId;
  }

  public void setLeagueId(Long leagueId) {
    this.leagueId = leagueId;
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

  public String toJson() {
    return new Gson().toJson(this, MatchDTO.class);
  }

  public static MatchDTO fromJson(String src) {
    return new Gson().fromJson(src, MatchDTO.class);
  }
}
