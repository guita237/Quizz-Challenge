package com.guita.Quizz.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private LocalDate birthDate;

    @JsonIgnore
    @OneToMany(mappedBy = "player", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Game> games = new ArrayList<>();

    public Player() {
    }

    public Player(String name, LocalDate birthDate) {
        this.name = name;
        this.birthDate = birthDate;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public List<Game> getGames() {
        return games;
    }

    public void addGame(Game game) {
        games.add(game);
        game.setPlayer(this);
    }

    public void removeGame(Game game) {
        games.remove(game);
        game.setPlayer(null);
    }
}
