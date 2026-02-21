package com.guita.Quizz.dto;

import java.util.List;

public class GameQuestionDto {

    private Long gameQuestionId;
    private Long questionId;
    private String text;
    private List<String> answers;

    public GameQuestionDto() {
    }

    public GameQuestionDto(Long gameQuestionId, Long questionId, String text, List<String> answers) {
        this.gameQuestionId = gameQuestionId;
        this.questionId = questionId;
        this.text = text;
        this.answers = answers;
    }

    public Long getGameQuestionId() {
        return gameQuestionId;
    }

    public void setGameQuestionId(Long gameQuestionId) {
        this.gameQuestionId = gameQuestionId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getAnswers() {
        return answers;
    }

    public void setAnswers(List<String> answers) {
        this.answers = answers;
    }
}
