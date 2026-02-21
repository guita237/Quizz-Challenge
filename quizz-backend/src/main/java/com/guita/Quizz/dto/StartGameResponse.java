package com.guita.Quizz.dto;

import java.util.List;

public class StartGameResponse {

    private Long gameId;
    private List<GameQuestionDto> questions;

    public StartGameResponse() {
    }

    public StartGameResponse(Long gameId, List<GameQuestionDto> questions) {
        this.gameId = gameId;
        this.questions = questions;
    }

    public Long getGameId() {
        return gameId;
    }

    public void setGameId(Long gameId) {
        this.gameId = gameId;
    }

    public List<GameQuestionDto> getQuestions() {
        return questions;
    }

    public void setQuestions(List<GameQuestionDto> questions) {
        this.questions = questions;
    }
}
