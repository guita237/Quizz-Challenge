package com.guita.Quizz.dto;

import java.util.List;

public class SubmitAnswersRequest {

    private List<AnswerSubmissionDto> answers;

    public SubmitAnswersRequest() {
    }

    public List<AnswerSubmissionDto> getAnswers() {
        return answers;
    }

    public void setAnswers(List<AnswerSubmissionDto> answers) {
        this.answers = answers;
    }
}
