package com.tourneygen.web.Controllers;

import com.tourneygen.web.Models.DTOs.UserDTO;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.User;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import javax.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController()
public class UserController {
  private UserRepository userRepository;

  @Autowired
  public UserController(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @GetMapping("/user")
  public List<User> getUsers(@RequestParam(name = "id", defaultValue = "-1") long id) {
    return id < 0
        ? userRepository.findAll()
        : Collections.singletonList(
            userRepository
                .findById(id)
                .orElseThrow(
                    () -> new EntityNotFoundException("User with id " + id + " was not found")));
  }

  @PostMapping(value = "/user")
  public User saveUser(@Valid @RequestBody User user) {
    return userRepository.save(user);
  }

  @PutMapping(value = "/user")
  public User updateUser(@Valid @RequestBody UserDTO userDTO) {
    User user =
        userRepository
            .findById(userDTO.getId())
            .orElseThrow(
                () ->
                    new EntityNotFoundException(
                        "User with id " + userDTO.getId() + " was not found"));
    user.merge(userDTO);
    return userRepository.save(user);
  }

  @DeleteMapping(value = "/user")
  public String deleteUser(@RequestParam(name = "id") long id) {
    userRepository.deleteById(id);
    return "Successfully deleted user with id " + id;
  }
}
