package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.DTOs.UserDTO;
import com.tourneygen.web.Models.DTOs.UserUpdateDTO;
import com.tourneygen.web.Models.Services.UserService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController()
public class UserController {
  private UserService userService;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/user")
  public List<UserDTO> getUsers(@RequestParam(name = "id", defaultValue = "-1") long id) {
    return userService.findUserList(id);
  }

  @PostMapping(value = "/user")
  public UserDTO saveUser(@Valid @RequestBody UserDTO user) {
    return userService.createUser(user);
  }

  @PutMapping(value = "/user")
  public UserDTO updateUser(@Valid @RequestBody UserUpdateDTO userDTO) {
    return userService.updateUser(userDTO);
  }

  @DeleteMapping(value = "/user")
  public String deleteUser(@RequestParam(name = "id") long id) {
    // userRepository.deleteById(id);
    return "Endpoint Disabled for now";
  }
}
