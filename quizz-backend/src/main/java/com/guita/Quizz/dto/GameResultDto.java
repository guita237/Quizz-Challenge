package com.guita.Quizz.dto;

import java.util.List;

public class GameResultDto {

    private Long gameId;
    private int totalQuestions;
    private int correctAnswers;
    private int score;
    private List<QuestionResultDto> details;

    public GameResultDto() {
    }

    public GameResultDto(Long gameId, int totalQuestions, int correctAnswers, int score,
                         List<QuestionResultDto> details) {
        this.gameId = gameId;
        this.totalQuestions = totalQuestions;
        this.correctAnswers = correctAnswers;
        this.score = score;
        this.details = details;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public int getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(int correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public List<QuestionResultDto> getDetails() {
        return details;
    }

    public void setDetails(List<QuestionResultDto> details) {
        this.details = details;
    }
}
