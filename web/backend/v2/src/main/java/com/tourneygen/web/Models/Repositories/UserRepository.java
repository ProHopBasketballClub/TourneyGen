package com.tourneygen.web.Models.Repositories;

import com.tourneygen.web.Models.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, Long> {
  List<User> findAll();

  Optional<User> findById(long id);
}
