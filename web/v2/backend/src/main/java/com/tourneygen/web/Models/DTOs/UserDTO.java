package com.tourneygen.web.Models.DTOs;

import com.google.gson.Gson;
import com.tourneygen.web.Models.League;
import com.tourneygen.web.Models.Team;
import com.tourneygen.web.Models.User;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;

public class UserDTO {

  private Long id;

  @Size(min = User.MIN_DISPLAY_NAME_LENGTH, max = User.MAX_DISPLAY_NAME_LENGTH)
  private String displayName;

  @Email private String email;

  private Set<Long> leagues = new HashSet<>();

  private Set<Long> teams = new HashSet<>();

  public UserDTO() {}

  public UserDTO(User user) {
    this.id = user.getId();
    this.displayName = user.getDisplayName();
    this.email = user.getEmail();
    this.leagues = user.getLeagues().stream().map(League::getId).collect(Collectors.toSet());
    this.teams = user.getTeams().stream().map(Team::getId).collect(Collectors.toSet());
  }

  public static List<UserDTO> findAll(List<User> userList) {
    ArrayList<UserDTO> userDTOS = new ArrayList<>();
    userList.forEach(user -> userDTOS.add(new UserDTO(user)));
    return userDTOS;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public Long getId() {
    return id;
  }

  public Set<Long> getTeams() {
    return teams;
  }

  public void setTeams(Set<Long> teams) {
    this.teams = teams;
  }

  public Set<Long> getLeagues() {
    return leagues;
  }

  public void setLeagues(Set<Long> leagues) {
    this.leagues = leagues;
  }

  public String toJson() {
    return new Gson().toJson(this, UserDTO.class);
  }
}
