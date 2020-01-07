package com.tourneygen.web.Models;

import javax.persistence.*;

@Entity
public class Match {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne private Team home;

  @ManyToOne private Team away;
}
