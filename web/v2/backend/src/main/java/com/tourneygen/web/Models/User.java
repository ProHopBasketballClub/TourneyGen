package com.tourneygen.web.Models;

import com.google.gson.Gson;
import com.tourneygen.web.Models.DTOs.UserDTO;
import com.tourneygen.web.Models.DTOs.UserUpdateDTO;
import com.tourneygen.web.Models.Repositories.UserRepository;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {

  public static final int MIN_DISPLAY_NAME_LENGTH = 4;
  public static final int MAX_DISPLAY_NAME_LENGTH = 50;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Size(min = MIN_DISPLAY_NAME_LENGTH, max = MAX_DISPLAY_NAME_LENGTH)
  @Column(unique = true)
  private String displayName;

  @Email
  @NotBlank(message = "is required")
  private String email;

  @OneToMany(
      targetEntity = League.class,
      mappedBy = "owner",
      cascade = CascadeType.ALL,
      fetch = FetchType.EAGER)
  private Set<League> leagues = new HashSet<>();

  @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  private Set<Team> Teams = new HashSet<>();

  public User() {}

  // Test Constructor
  public User(String displayName, String email) {
    this.displayName = displayName;
    this.email = email;
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

  public void setId(Long id) {
    this.id = id;
  }

  @Override
  public boolean equals(Object o) {
    User cmp = (User) o;
    return cmp.email.equals(this.email) && this.displayName.equals(cmp.displayName);
  }

  public String toJson() {
    return new Gson().toJson(this, User.class);
  }

  public static User fromJson(String data) {
    return new Gson().fromJson(data, User.class);
  }

  public void merge(UserUpdateDTO userDTO) {
    this.id = userDTO.getId();
    if (userDTO.getDisplayName() != null) {
      this.displayName = userDTO.getDisplayName();
    }
    if (userDTO.getEmail() != null) {
      this.email = userDTO.getEmail();
    }
  }

  public Set<League> getLeagues() {
    return leagues;
  }

  public void setLeagues(Set<League> leagues) {
    this.leagues = leagues;
  }

  public Set<Team> getTeams() {
    return Teams;
  }

  public void setTeams(Set<Team> teams) {
    Teams = teams;
  }

  public void create(UserDTO userDTO, UserRepository userRepository) {
    this.displayName = userDTO.getDisplayName();
    this.email = userDTO.getEmail();
  }
}
