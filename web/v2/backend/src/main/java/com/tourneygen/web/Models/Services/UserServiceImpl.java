package com.tourneygen.web.Models.Services;

import com.tourneygen.web.Models.DTOs.UserDTO;
import com.tourneygen.web.Models.DTOs.UserUpdateDTO;
import com.tourneygen.web.Models.Repositories.UserRepository;
import com.tourneygen.web.Models.User;
import java.util.Collections;
import java.util.List;
import javax.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

  private UserRepository userRepository;

  @Autowired
  public UserServiceImpl(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Override
  public void deleteUser(long Id) {}

  @Override
  public UserDTO updateUser(UserUpdateDTO userDTO) {
    User user = new User();
    user.merge(userDTO);
    return new UserDTO(userRepository.save(user));
  }

  @Override
  public UserDTO createUser(UserDTO userDTO) {
    User user = new User();
    user.create(userDTO, userRepository);
    return new UserDTO(userRepository.save(user));
  }

  @Override
  public List<UserDTO> findUserList(long id) {
    return id < 0
        ? UserDTO.findAll(userRepository.findAll())
        : Collections.singletonList(
            new UserDTO(
                userRepository
                    .findById(id)
                    .orElseThrow(
                        () ->
                            new EntityNotFoundException("User with id " + id + " was not found"))));
  }
}
