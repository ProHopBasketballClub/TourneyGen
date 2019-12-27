package com.tourneygen.web.Models;

import javax.persistence.*;

@Entity
public class Tournament {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @ManyToOne private League league;

  public Long getId() {
    return id;
  }
}
