package com.tourneygen.web.Models;

import com.google.gson.Gson;
import com.tourneygen.web.Models.DTOs.UserDTO;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
public class User {

  public static final int MIN_DISPLAY_NAME_LENGTH = 4;
  public static final int MAX_DISPLAY_NAME_LENGTH = 50;

  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @Size(min = MIN_DISPLAY_NAME_LENGTH, max = MAX_DISPLAY_NAME_LENGTH)
  @Column(unique = true)
  private String displayName;

  @Email
  @NotBlank(message = "is required")
  private String email;

  @ManyToOne
  private League[] leagues;

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

  public void merge(UserDTO userDTO) {
    if (userDTO.getDisplayName() != null) {
      this.displayName = userDTO.getDisplayName();
    }
    if (userDTO.getEmail() != null) {
      this.email = userDTO.getEmail();
    }
  }
}
