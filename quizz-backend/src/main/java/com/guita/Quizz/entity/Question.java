package com.guita.Quizz.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 1000)
    private String text;

    @ManyToOne(optional = false)
    @JoinColumn(name = "category_id")
    private Category category;

    @ElementCollection
    @CollectionTable(
            name = "question_answers",
            joinColumns = @JoinColumn(name = "question_id")
    )
    private List<Answer> answers = new ArrayList<>();

    /**
     * Index (0-based) of the correct answer in the “answers” list.
     */
    @Column(name = "correct_answer_index")
    private Integer correctAnswerIndex;

    public Question() {
    }

    public Question(String text, Category category) {
        this.text = text;
        this.category = category;
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public List<Answer> getAnswers() {
        return answers;
    }

    public void setAnswers(List<Answer> answers) {
        this.answers = answers;
    }

    public void addAnswer(Answer answer) {
        this.answers.add(answer);
    }

    public Integer getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    public void setCorrectAnswerIndex(Integer correctAnswerIndex) {
        this.correctAnswerIndex = correctAnswerIndex;
    }
}
