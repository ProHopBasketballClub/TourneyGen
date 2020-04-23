package com.tourneygen.web.Models.DTOs;

import com.google.gson.Gson;
import javax.validation.constraints.NotNull;

public class MatchReportDTO {
  @NotNull private Long matchId;

  @NotNull private Integer homeScore;

  @NotNull private Integer awayScore;

  @NotNull private Long victorId;

  @NotNull Long loserId;

  @NotNull Long upDatedBy;

  private String status;

  public MatchReportDTO() {}

  public Long getUpDatedBy() {
    return upDatedBy;
  }

  public void setUpDatedBy(Long upDatedBy) {
    this.upDatedBy = upDatedBy;
  }

  public Long getMatchId() {
    return matchId;
  }

  public void setMatchId(Long matchId) {
    this.matchId = matchId;
  }

  public Integer getHomeScore() {
    return homeScore;
  }

  public void setHomeScore(Integer homeScore) {
    this.homeScore = homeScore;
  }

  public Integer getAwayScore() {
    return awayScore;
  }

  public void setAwayScore(Integer awayScore) {
    this.awayScore = awayScore;
  }

  public Long getVictorId() {
    return victorId;
  }

  public void setVictorId(Long victorId) {
    this.victorId = victorId;
  }

  public Long getLoserId() {
    return loserId;
  }

  public void setLoserId(Long loserId) {
    this.loserId = loserId;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String toJson() {
    return new Gson().toJson(this, MatchReportDTO.class);
  }
}
