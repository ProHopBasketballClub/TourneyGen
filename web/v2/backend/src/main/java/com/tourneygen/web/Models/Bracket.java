package com.tourneygen.web.Models;

import javax.persistence.*;

@Entity
public class Bracket {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  public Bracket() {}
}
