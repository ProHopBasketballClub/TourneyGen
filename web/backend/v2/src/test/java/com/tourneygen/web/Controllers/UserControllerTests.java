package com.tourneygen.web.Controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.User;
import java.util.List;
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
public class UserControllerTests {
  @Autowired private MockMvc mvc;

  @Autowired private UserRepository userRepository;

  @Test
  public void createUser_ThenSucceed() throws Exception {
    User user = new User("eetar1", "a@b.c");

    RequestBuilder request =
        put("/user").contentType(MediaType.APPLICATION_JSON).content(user.toJson());
    MvcResult result = mvc.perform(request).andExpect(status().isOk()).andReturn();

    List<User> userList = userRepository.findAll();
    assert userList.size() == 1;
  }

  @AfterEach
  private void cleanUserRepo() {
    userRepository.deleteAll();
  }
}
