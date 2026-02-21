package com.guita.Quizz.dto;

public class AnswerSubmissionDto {

    private Long gameQuestionId;
    private Integer chosenAnswerIndex;

    public AnswerSubmissionDto() {
    }

    public Long getGameQuestionId() {
        return gameQuestionId;
    }

    public void setGameQuestionId(Long gameQuestionId) {
        this.gameQuestionId = gameQuestionId;
    }

    public Integer getChosenAnswerIndex() {
        return chosenAnswerIndex;
    }

    public void setChosenAnswerIndex(Integer chosenAnswerIndex) {
        this.chosenAnswerIndex = chosenAnswerIndex;
    }
}
