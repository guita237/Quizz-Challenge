package com.guita.Quizz.dto;

public class QuestionResultDto {

    private String questionText;
    private Integer chosenAnswerIndex;
    private Integer correctAnswerIndex;
    private Boolean correct;

    public QuestionResultDto() {
    }

    public QuestionResultDto(String questionText,
                             Integer chosenAnswerIndex,
                             Integer correctAnswerIndex,
                             Boolean correct) {
        this.questionText = questionText;
        this.chosenAnswerIndex = chosenAnswerIndex;
        this.correctAnswerIndex = correctAnswerIndex;
        this.correct = correct;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public Integer getChosenAnswerIndex() {
        return chosenAnswerIndex;
    }

    public void setChosenAnswerIndex(Integer chosenAnswerIndex) {
        this.chosenAnswerIndex = chosenAnswerIndex;
    }

    public Integer getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    public void setCorrectAnswerIndex(Integer correctAnswerIndex) {
        this.correctAnswerIndex = correctAnswerIndex;
    }

    public Boolean getCorrect() {
        return correct;
    }

    public void setCorrect(Boolean correct) {
        this.correct = correct;
    }
}
