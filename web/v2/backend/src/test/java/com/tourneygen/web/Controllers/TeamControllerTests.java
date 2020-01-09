package com.tourneygen.web.Controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.google.gson.Gson;
import com.tourneygen.web.Models.DTOs.TeamDTO;
import com.tourneygen.web.Models.DTOs.TeamUpdateDTO;
import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.TeamRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.Team;
import com.tourneygen.web.Models.User;
import java.util.HashSet;
import java.util.List;
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
public class TeamControllerTests {
  @Autowired private MockMvc mvc;

  @Autowired private UserRepository userRepository;

  @Autowired private LeagueRepository leagueRepository;

  @Autowired private TeamRepository teamRepository;

  private User user;
  private League league;

  @Test
  public void createTeam_ThenSucceed() throws Exception {
    // Create a team to save
    TeamDTO teamToSave = new TeamDTO();
    teamToSave.setDescription("Yes");
    teamToSave.setLeague(league.getId());
    teamToSave.setName("Team 1");
    Set<String> roster = new HashSet<>();
    roster.add("eetar1");
    teamToSave.setRoster(roster);
    teamToSave.setOwner(user.getId());

    List<Team> teamList = teamRepository.findAll();
    assert teamList.size() == 0;

    RequestBuilder request =
        post("/team").contentType(MediaType.APPLICATION_JSON).content(teamToSave.toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();

    teamList = teamRepository.findAll();

    assert teamList.size() == 1;
  }

  @Test
  void updateTeam_ThenSucceed() throws Exception {
    Team teamToSave = new Team();
    teamToSave.setName("Team 1");
    teamToSave.setDescription("Bois");
    teamToSave.setOwner(user);
    teamToSave.setLeague(league);
    Set<String> roster = new HashSet<>();
    roster.add("eetar1");
    teamToSave.setRoster(roster);

    assert teamRepository.findAll().size() == 0;
    teamRepository.save(teamToSave);

    teamToSave.setName("New Name");
    TeamUpdateDTO teamDTO = new TeamUpdateDTO(teamToSave);

    RequestBuilder request =
        put("/team").contentType(MediaType.APPLICATION_JSON).content(teamDTO.toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();

    List<Team> teamList = teamRepository.findAll();
    assert teamList.size() == 1;
    assert teamList.get(0).getName().equals("New Name");
  }

  @Test
  public void getTeam_ThenSucceed() throws Exception {
    Team teamToSave = new Team();
    teamToSave.setName("Team 1");
    teamToSave.setDescription("Bois");
    teamToSave.setOwner(user);
    teamToSave.setLeague(league);
    Set<String> roster = new HashSet<>();
    roster.add("eetar1");
    teamToSave.setRoster(roster);
    teamRepository.save(teamToSave);

    RequestBuilder request = get("/team").contentType(MediaType.APPLICATION_JSON).param("id", "-1");
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();
    TeamDTO[] userList =
        new Gson().fromJson(result.getResponse().getContentAsString(), TeamDTO[].class);

    assert teamRepository.findAll().size() == 1;
    assert userList[0].getName().equals("Team 1");
  }

  @Test
  public void deleteTeam_ThenSucceed() throws Exception {
    Team teamToSave = new Team();
    teamToSave.setName("Team 1");
    teamToSave.setDescription("Bois");
    teamToSave.setOwner(user);
    teamToSave.setLeague(league);
    Set<String> roster = new HashSet<>();
    roster.add("eetar1");
    teamToSave.setRoster(roster);
    teamToSave = teamRepository.save(teamToSave);

    RequestBuilder request =
        delete("/team")
            .contentType(MediaType.APPLICATION_JSON)
            .param("id", teamToSave.getId().toString());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();

    assert teamRepository.findAll().size() == 0;
  }

  @BeforeEach
  private void createUserLeague() {
    user = new User();
    league = new League();

    user.setDisplayName("Name");
    user.setEmail("a@b.c");

    user = userRepository.save(user);

    league.setName("League");
    league.setDescription("Yes");
    league.setGame_type("R7");
    league.setOwner(user);

    league = leagueRepository.save(league);
  }

  @AfterEach
  private void cleanUserRepo() {
    teamRepository.deleteAll();
    leagueRepository.deleteAll();
    userRepository.deleteAll();
  }
}
