package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.DTOs.UserDTO;
import com.tourneygen.web.Models.DTOs.UserUpdateDTO;
import java.util.List;

public interface UserService {
  void deleteUser(long Id);

  UserDTO updateUser(UserUpdateDTO userDTO);

  UserDTO createUser(UserDTO leagueDTO);

  List<UserDTO> findUserList(long id);
}
