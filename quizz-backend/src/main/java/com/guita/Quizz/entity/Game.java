package com.guita.Quizz.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import com.guita.Quizz.entity.Language;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "player_id")
    private Player player;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 2)
    private Language language;

    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;

    /**
     * Final score (e.g., number of correct answers).
     */
    private Integer score;

    @OneToMany(mappedBy = "game", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GameQuestion> gameQuestions = new ArrayList<>();

    public Game() {
    }

    public Game(Player player) {
        this.player = player;
        this.startedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Player getPlayer() {
        return player;
    }

    public void setPlayer(Player player) {
        this.player = player;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }


    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getFinishedAt() {
        return finishedAt;
    }

    public void setFinishedAt(LocalDateTime finishedAt) {
        this.finishedAt = finishedAt;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public List<GameQuestion> getGameQuestions() {
        return gameQuestions;
    }

    public void addGameQuestion(GameQuestion gameQuestion) {
        gameQuestions.add(gameQuestion);
        gameQuestion.setGame(this);
    }

    public void removeGameQuestion(GameQuestion gameQuestion) {
        gameQuestions.remove(gameQuestion);
        gameQuestion.setGame(null);
    }
}
