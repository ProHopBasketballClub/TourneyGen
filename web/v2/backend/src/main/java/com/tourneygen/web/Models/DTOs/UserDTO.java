package com.tourneygen.web.Models.DTOs;

import com.tourneygen.web.Models.User;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class UserDTO {

  @NotNull private Long id;

  @Size(min = User.MIN_DISPLAY_NAME_LENGTH, max = User.MAX_DISPLAY_NAME_LENGTH)
  private String displayName;

  @Email private String email;

  public UserDTO() {}

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
}
