package com.tourneygen.web.Controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.google.gson.Gson;
import com.tourneygen.web.Models.DTOs.MatchDTO;
import com.tourneygen.web.Models.DTOs.MatchReportDTO;
import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Match;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.MatchRepository;
import com.tourneygen.web.Models.Repositories.TeamRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.Team;
import com.tourneygen.web.Models.User;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;

@SpringBootTest
@AutoConfigureMockMvc
public class MatchControllerTests {
  @Autowired MockMvc mvc;

  @Autowired LeagueRepository leagueRepository;

  @Autowired UserRepository userRepository;

  @Autowired TeamRepository teamRepository;

  @Autowired MatchRepository matchRepository;

  private User user;
  private League league;
  private Team homeTeam;
  private Team awayTeam;

  @BeforeEach
  private void setup() {
    User user = new User();
    user.setEmail("a@b.c");
    user.setDisplayName("Ethan");
    user = userRepository.save(user);
    league = new League();
    league.setOwner(user);
    league.setGame_type("R7");
    league.setDescription("A");
    league = leagueRepository.save(league);
    Team team = new Team();
    team.setName("Team 1");
    team.setLeague(league);
    team.setOwner(user);
    Set<String> roster = new HashSet<>();
    roster.add("eetar1");
    team.setRoster(roster);
    team.setDescription("Yes");
    homeTeam = teamRepository.save(team);
    Team team2 = new Team();
    team2.setName("Team 2");
    team2.setLeague(league);
    team2.setOwner(user);
    Set<String> roster2 = new HashSet<>();
    roster.add("eetar2");
    team2.setRoster(roster);
    team2.setDescription("Yes");
    awayTeam = teamRepository.save(team2);
  }

  @Test
  public void createMatch_ThenSucceed() throws Exception {
    MatchDTO matchToSave = new MatchDTO();
    matchToSave.setTitle("Big Match");
    matchToSave.setAwayId(awayTeam.getId());
    matchToSave.setHomeId(homeTeam.getId());
    matchToSave.setLeagueId(league.getId());
    assert matchRepository.findAll().size() == 0;
    RequestBuilder request =
        post("/match").contentType(MediaType.APPLICATION_JSON).content(matchToSave.toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();

    assert matchRepository.findAll().size() == 1;
  }

  @Test
  void getMatch_ThenSucceed() throws Exception {
    Match match = new Match();
    match.setHomeTeam(homeTeam);
    match.setAwayTeam(awayTeam);
    match.setTitle("Yes");
    match.setLeague(league);
    matchRepository.save(match);
    match.setTitle("Match2");
    match.setId(null);
    match = matchRepository.save(match);

    RequestBuilder request =
        get("/match").contentType(MediaType.APPLICATION_JSON).param("id", match.getId().toString());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();
    MatchDTO[] matches =
        new Gson().fromJson(result.getResponse().getContentAsString(), MatchDTO[].class);
    assert matches.length == 1;
    assert matches[0].getTitle().equals("Match2");

    request = get("/match").contentType(MediaType.APPLICATION_JSON);
    result = mvc.perform(request).andExpect(status().isOk()).andReturn();
    matches = new Gson().fromJson(result.getResponse().getContentAsString(), MatchDTO[].class);
    assert matches.length == 2;
  }

  @Test
  public void completeMatch_ThenSucceed() throws Exception {
    Match match = new Match();
    match.setHomeTeam(homeTeam);
    match.setAwayTeam(awayTeam);
    match.setTitle("Yes");
    match.setLeague(league);
    matchRepository.save(match);
    match.setTitle("Match2");
    match.setId(null);
    match = matchRepository.save(match);

    MatchReportDTO reportDTO = new MatchReportDTO();

    reportDTO.setMatchId(match.getId());
    reportDTO.setVictorId(homeTeam.getId());
    reportDTO.setLoserId(awayTeam.getId());
    reportDTO.setHomeScore(20);
    reportDTO.setAwayScore(1);
    reportDTO.setUpDatedBy(homeTeam.getId());

    RequestBuilder request =
        put("/match/report").contentType(MediaType.APPLICATION_JSON).content(reportDTO.toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();
    match = matchRepository.findById(match.getId()).orElseThrow();

    assert match.getVictor().equals(homeTeam);
    assert match.getLoser().equals(awayTeam);
    assert match.getHomeScore() == 20;
    assert match.getAwayScore() == 1;
    assert match.getStatus().equals("Pending_Report");

    reportDTO.setUpDatedBy(awayTeam.getId());
    request =
        put("/match/report").contentType(MediaType.APPLICATION_JSON).content(reportDTO.toJson());
    result = mvc.perform(request).andExpect(status().isOk()).andReturn();
    match = matchRepository.findById(match.getId()).orElseThrow();
  }

  @Test
  public void conflictMatch_ThenResolveAndSucceed() throws Exception {
    Match match = new Match();
    match.setHomeTeam(homeTeam);
    match.setAwayTeam(awayTeam);
    match.setTitle("Yes");
    match.setLeague(league);
    matchRepository.save(match);
    match.setTitle("Match2");
    match.setId(null);
    match = matchRepository.save(match);

    MatchReportDTO reportDTO = new MatchReportDTO();

    reportDTO.setMatchId(match.getId());
    reportDTO.setVictorId(homeTeam.getId());
    reportDTO.setLoserId(awayTeam.getId());
    reportDTO.setHomeScore(20);
    reportDTO.setAwayScore(1);
    reportDTO.setUpDatedBy(homeTeam.getId());

    RequestBuilder request =
        put("/match/report").contentType(MediaType.APPLICATION_JSON).content(reportDTO.toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();
    match = matchRepository.findById(match.getId()).orElseThrow();

    reportDTO.setUpDatedBy(awayTeam.getId());
    reportDTO.setAwayScore(2);
    request =
        put("/match/report").contentType(MediaType.APPLICATION_JSON).content(reportDTO.toJson());
    result = mvc.perform(request).andExpect(status().isConflict()).andReturn();
    match = matchRepository.findById(match.getId()).orElseThrow();

    assert match.getStatus().equals("In_Conflict");
    reportDTO.setUpDatedBy(match.getLeague().getOwner().getId());
    request =
        put("/match/resolve").contentType(MediaType.APPLICATION_JSON).content(reportDTO.toJson());
    result = mvc.perform(request).andExpect(status().isOk()).andReturn();

    match = matchRepository.findById(match.getId()).orElseThrow();

    assert match.getStatus().equals("Completed");
    assert match.getAwayScore() == 2;
    assert match.getHomeScore() == 20;
    assert match.getVictor().equals(homeTeam);
    assert match.getLoser().equals(awayTeam);
  }

  @AfterEach
  private void cleanRepos() {
    leagueRepository.deleteAll();
    userRepository.deleteAll();
  }
}
