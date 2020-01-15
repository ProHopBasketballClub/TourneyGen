package com.tourneygen.web.Controllers;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.tourneygen.web.Models.Repositories.UserRepository;
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
public class ErrorControllerTests {

  @Autowired MockMvc mvc;

  @Autowired private UserRepository userRepository;

  @Test
  public void missingParam_400Error() throws Exception {
    RequestBuilder request = delete("/user").contentType(MediaType.APPLICATION_JSON);
    MvcResult result = mvc.perform(request).andExpect(status().isBadRequest()).andReturn();
  }

  @Test
  public void missingBody_400Error() throws Exception {
    RequestBuilder request = post("/user").contentType(MediaType.APPLICATION_JSON);
    MvcResult result = mvc.perform(request).andExpect(status().isBadRequest()).andReturn();
  }

  @Test
  public void badId_404Error() throws Exception {
    RequestBuilder request =
        delete("/user").contentType(MediaType.APPLICATION_JSON).param("id", "-1");
    MvcResult result = mvc.perform(request).andExpect(status().isNotFound()).andReturn();
  }

  @Test
  public void missingId_404Error() throws Exception {
    RequestBuilder request =
        delete("/user").contentType(MediaType.APPLICATION_JSON).param("id", "16");
    MvcResult result = mvc.perform(request).andExpect(status().isNotFound()).andReturn();
  }
}
