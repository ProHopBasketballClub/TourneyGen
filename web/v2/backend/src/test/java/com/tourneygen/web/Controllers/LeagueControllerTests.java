package com.tourneygen.web.Controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.google.gson.Gson;
import com.tourneygen.web.Models.DTOs.LeagueDTO;
import com.tourneygen.web.Models.DTOs.LeagueUpdateDTO;
import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Repositories.LeagueRepository;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.User;
import javax.persistence.EntityNotFoundException;
import org.junit.jupiter.api.AfterEach;
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
public class LeagueControllerTests {

  @Autowired MockMvc mvc;

  @Autowired LeagueRepository leagueRepository;

  @Autowired UserRepository userRepository;

  @Test
  public void createUser_ThenSucceed() throws Exception {
    User user = new User("eetar1", "a@b.c");
    user = userRepository.save(user);

    LeagueDTO league = new LeagueDTO("Yes", user, "R7", "Yes");

    RequestBuilder request =
        post("/league").contentType(MediaType.APPLICATION_JSON).content(league.toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();
    assert leagueRepository.findAll().size() == 1;
  }

  @Test
  public void getAllUser_ThenSucceed() throws Exception {
    User user = new User("eetar1", "a@b.c");
    user = userRepository.save(user);
    League league = new League("Yes", user, "R7", "Yes");
    leagueRepository.save(league);

    RequestBuilder request = get("/league").contentType(MediaType.APPLICATION_JSON);
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();
    LeagueDTO[] leagueList =
        new Gson().fromJson(result.getResponse().getContentAsString(), LeagueDTO[].class);

    assert leagueList.length == 1;
    assert leagueList[0].name.equals("Yes");
  }

  @Test
  public void getAUser_ThenSucceed() throws Exception {
    User user = new User("eetar1", "a@b.c");
    user = userRepository.save(user);
    League league = new League("Yes", user, "R7", "Yes");
    leagueRepository.save(league);

    RequestBuilder request =
        get("/league")
            .contentType(MediaType.APPLICATION_JSON)
            .param("id", league.getId().toString());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();
    LeagueDTO[] leagueList =
        new Gson().fromJson(result.getResponse().getContentAsString(), LeagueDTO[].class);

    assert leagueList[0].name.equals("Yes");
  }

  @Test
  public void updateUser_ThenSucceed() throws Exception {
    User user = new User("eetar1", "a@b.c");
    user = userRepository.save(user);
    League league = new League("Yes", user, "R7", "Yes");
    leagueRepository.save(league);

    league.setName("New Name");
    RequestBuilder request =
        put("/league")
            .contentType(MediaType.APPLICATION_JSON)
            .content(new LeagueUpdateDTO(league).toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();

    League savedLeague =
        leagueRepository.findById(league.getId()).orElseThrow(EntityNotFoundException::new);

    assert savedLeague.getName().equals("New Name");
  }

  @Test
  public void deleteLeague_ThenSucceed() throws Exception {
    User user = new User("eetar1", "a@b.c");
    user = userRepository.save(user);
    League league = new League("Yes", user, "R7", "Yes");
    leagueRepository.save(league);
    assert leagueRepository.findAll().size() == 1;
    RequestBuilder request =
        delete("/league")
            .contentType(MediaType.APPLICATION_JSON)
            .param("id", league.getId().toString());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();

    assert leagueRepository.findAll().size() == 0;
  }

  @AfterEach
  private void cleanRepos() {
    leagueRepository.deleteAll();
    userRepository.deleteAll();
  }
}
