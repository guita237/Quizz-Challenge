package com.guita.Quizz.dto;

import com.guita.Quizz.entity.Language;

public class CategoryQuestionCountDto {
    private Long categoryId;
    private String categoryName;
    private Language language;
    private int availableQuestions;
    private int requestedQuestions;
    private boolean sufficient;

    public CategoryQuestionCountDto() {}

    public CategoryQuestionCountDto(Long categoryId, String categoryName, Language language, int availableQuestions) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.language = language;
        this.availableQuestions = availableQuestions;
        this.requestedQuestions = 0;
        this.sufficient = true;
    }

    // Getters et Setters
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }

    public int getAvailableQuestions() { return availableQuestions; }
    public void setAvailableQuestions(int availableQuestions) { this.availableQuestions = availableQuestions; }

    public int getRequestedQuestions() { return requestedQuestions; }
    public void setRequestedQuestions(int requestedQuestions) { this.requestedQuestions = requestedQuestions; }

    public boolean isSufficient() { return sufficient; }
    public void setSufficient(boolean sufficient) { this.sufficient = sufficient; }
}