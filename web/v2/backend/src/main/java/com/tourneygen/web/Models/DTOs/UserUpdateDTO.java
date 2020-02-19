package com.tourneygen.web.Models.DTOs;

import com.google.gson.Gson;
import com.tourneygen.web.Models.User;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;

public class UserUpdateDTO {

  @NotNull private Long id;

  private String displayName;

  @Email private String email;

  public UserUpdateDTO() {}

  public UserUpdateDTO(User user) {
    this.id = user.getId();
    this.displayName = user.getDisplayName();
    this.email = user.getEmail();
  }

  public String getDisplayName() {
    return displayName;
  }

  public void setDisplayName(String displayName) {
    this.displayName = displayName;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public Long getId() {
    return id;
  }

  public String toJson() {
    return new Gson().toJson(this, UserUpdateDTO.class);
  }
}
