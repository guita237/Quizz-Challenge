package com.guita.Quizz.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class Answer {

    private String text;

    public Answer() {
    }

    public Answer(String text) {
        this.text = text;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
