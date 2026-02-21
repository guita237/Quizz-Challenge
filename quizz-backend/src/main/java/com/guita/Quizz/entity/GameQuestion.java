package com.guita.Quizz.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "game_questions")
public class GameQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "game_id")
    private Game game;

    @ManyToOne(optional = false)
    @JoinColumn(name = "question_id")
    private Question question;

    /**
     * Index (0-based) of the answer chosen by the player.
     * May be null if the question has not been answered.
     */
    @Column(name = "chosen_answer_index")
    private Integer chosenAnswerIndex;

    /**
     * true if the chosen answer is correct.
     */
    private Boolean correct;

    public GameQuestion() {
    }

    public GameQuestion(Game game, Question question) {
        this.game = game;
        this.question = question;
    }

    public Long getId() {
        return id;
    }

    public Game getGame() {
        return game;
    }

    public void setGame(Game game) {
        this.game = game;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public Integer getChosenAnswerIndex() {
        return chosenAnswerIndex;
    }

    public void setChosenAnswerIndex(Integer chosenAnswerIndex) {
        this.chosenAnswerIndex = chosenAnswerIndex;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }
}
