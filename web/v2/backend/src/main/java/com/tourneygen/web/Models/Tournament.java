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

  private String name;

  private String roundResetTime;

  private Date startDate;

  private Date endDate;

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
    return startDate;
  }

  public void setDate(Date date) {
    this.startDate = date;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Date getEndDate() {
    return endDate;
  }

  public void setEndDate(Date endDate) {
    this.endDate = endDate;
  }
}
