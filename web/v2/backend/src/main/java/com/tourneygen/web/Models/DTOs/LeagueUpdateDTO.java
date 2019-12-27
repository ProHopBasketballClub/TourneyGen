package com.tourneygen.web.Models.DTOs;

import com.tourneygen.web.Models.League;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class LeagueUpdateDTO {

    @NotNull
    private long id;

    @Size(min = 1, max = League.MAX_LEAGUE_NAME_SIZE)
    private String name;

    private Long owner;

    @Size(min = 1)
    private String description;

    @Size(min = 1)
    private String game_type;

    private long[] teams;

    private long[] tournaments;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getGame_type() {
        return game_type;
    }

    public void setGame_type(String game_type) {
        this.game_type = game_type;
    }

    public long getId() {
        return id;
    }

    public Long getOwner() {
        return owner;
    }

    public void setOwner(long owner) {
        this.owner = owner;
    }

    public long[] getTournaments() {
        return tournaments;
    }

    public void setTournaments(long[] tournaments) {
        this.tournaments = tournaments;
    }

    public long[] getTeams() {
        return teams;
    }

    public void setTeams(long[] teams) {
        this.teams = teams;
    }
}
