package com.tourneygen.web.Controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.google.gson.Gson;
import com.tourneygen.web.Models.DTOs.UserDTO;
import com.tourneygen.web.Models.DTOs.UserUpdateDTO;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.User;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
public class UserControllerTests {
  @Autowired private MockMvc mvc;

  @Autowired private UserRepository userRepository;

  @Test
  public void createUser_ThenSucceed() throws Exception {
    User user = new User("eetar1", "a@b.c");
    UserDTO userDTO = new UserDTO(user);
    RequestBuilder request =
        post("/user").contentType(MediaType.APPLICATION_JSON).content(userDTO.toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();

    List<User> userList = userRepository.findAll();
    assert userList.size() == 1;
  }

  @Test
  public void updateUser_ThenSucceed() throws Exception {
    User user = new User("eetar1", "a@b.c");
    user = userRepository.save(user);
    user.setDisplayName("eetar2");
    UserUpdateDTO userUpdateDTO = new UserUpdateDTO(user);

    RequestBuilder request =
        put("/user").contentType(MediaType.APPLICATION_JSON).content(userUpdateDTO.toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();

    List<User> userList = userRepository.findAll();
    assert userList.get(0).getDisplayName().equals("eetar2");
    assert userList.size() == 1;
  }

  @Test
  public void getAllUser_ThenSucceed() throws Exception {
    User user = new User("eetar1", "a@b.c");
    user = userRepository.save(user);
    user = new User("eetar2", "a@b.c");
    userRepository.save(user);

    RequestBuilder request =
        get("/user").contentType(MediaType.APPLICATION_JSON).content(user.toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();
    User[] userList = new Gson().fromJson(result.getResponse().getContentAsString(), User[].class);
    assert userList.length == 2;
  }

  @AfterEach
  private void cleanUserRepo() {
    userRepository.deleteAll();
  }
}
