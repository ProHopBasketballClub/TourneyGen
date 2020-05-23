package com.tourneygen.web.Models;

import java.util.Date;
import java.util.Set;
import javax.persistence.*;

@Entity
public class Tournament {
  @Id
  @GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  @OneToMany private Set<Bracket> brackets;

  private String roundTime;

  private String roundResetTime;

  private Date date;

  public Long getId() {
    return id;
  }

  public String getRoundResetTime() {
    return roundResetTime;
  }

  public void setRoundResetTime(String roundResetTime) {
    this.roundResetTime = roundResetTime;
  }

  public String getRoundTime() {
    return roundTime;
  }

  public void setRoundTime(String roundTime) {
    this.roundTime = roundTime;
  }

  public Set<Bracket> getBrackets() {
    return brackets;
  }

  public void setBrackets(Set<Bracket> brackets) {
    this.brackets = brackets;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }
}
