package com.guita.Quizz.dto;

import com.guita.Quizz.entity.Language;
import java.util.List;

public class StartGameRequest {

    private Long playerId;
    private Language language;
    private List<String> categoryNames;

    private int questionsPerCategory;

    public StartGameRequest() {
    }

    public Long getPlayerId() {
        return playerId;
    }

    public void setPlayerId(Long playerId) {
        this.playerId = playerId;
    }

    public Language getLanguage() {
        return language;
    }

    public void setLanguage(Language language) {
        this.language = language;
    }

    public List<String> getCategoryNames() {
        return categoryNames;
    }

    public void setCategoryNames(List<String> categoryNames) {
        this.categoryNames = categoryNames;
    }

    public int getQuestionsPerCategory() {
        return questionsPerCategory;
    }

    public void setQuestionsPerCategory(int questionsPerCategory) {
        this.questionsPerCategory = questionsPerCategory;
    }
}
