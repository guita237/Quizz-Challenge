package com.guita.Quizz.dto;

import com.guita.Quizz.entity.Language;
import java.util.List;

public class QuestionAvailabilityResponse {
    private boolean allCategoriesAvailable;
    private List<CategoryQuestionCountDto> categories;
    private Language language;
    private String message;
    private String messageEn;
    private String messageDe;
    private String messageFr;

    public QuestionAvailabilityResponse() {}

    public QuestionAvailabilityResponse(boolean allCategoriesAvailable, List<CategoryQuestionCountDto> categories, Language language) {
        this.allCategoriesAvailable = allCategoriesAvailable;
        this.categories = categories;
        this.language = language;
        generateMessages();
    }

    private void generateMessages() {
        if (allCategoriesAvailable) {
            this.messageFr = "Toutes les catégories ont suffisamment de questions";
            this.messageEn = "All categories have enough questions";
            this.messageDe = "Alle Kategorien haben genügend Fragen";
            this.message = getMessageForLanguage();
        } else {
            StringBuilder sbFr = new StringBuilder("Catégories avec nombre de questions insuffisant :\n");
            StringBuilder sbEn = new StringBuilder("Categories with insufficient questions:\n");
            StringBuilder sbDe = new StringBuilder("Kategorien mit unzureichender Fragenanzahl:\n");

            for (CategoryQuestionCountDto cat : categories) {
                if (!cat.isSufficient()) {
                    sbFr.append("- ").append(cat.getCategoryName())
                            .append(": demandé ").append(cat.getRequestedQuestions())
                            .append(", disponible ").append(cat.getAvailableQuestions())
                            .append("\n");

                    sbEn.append("- ").append(cat.getCategoryName())
                            .append(": requested ").append(cat.getRequestedQuestions())
                            .append(", available ").append(cat.getAvailableQuestions())
                            .append("\n");

                    sbDe.append("- ").append(cat.getCategoryName())
                            .append(": angefordert ").append(cat.getRequestedQuestions())
                            .append(", verfügbar ").append(cat.getAvailableQuestions())
                            .append("\n");
                }
            }

            this.messageFr = sbFr.toString();
            this.messageEn = sbEn.toString();
            this.messageDe = sbDe.toString();
            this.message = getMessageForLanguage();
        }
    }

    private String getMessageForLanguage() {
        switch (language) {
            case EN: return messageEn;
            case DE: return messageDe;
            default: return messageFr;
        }
    }

    // Getters et Setters
    public boolean isAllCategoriesAvailable() { return allCategoriesAvailable; }
    public void setAllCategoriesAvailable(boolean allCategoriesAvailable) { this.allCategoriesAvailable = allCategoriesAvailable; }

    public List<CategoryQuestionCountDto> getCategories() { return categories; }
    public void setCategories(List<CategoryQuestionCountDto> categories) { this.categories = categories; }

    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getMessageEn() { return messageEn; }
    public void setMessageEn(String messageEn) { this.messageEn = messageEn; }

    public String getMessageDe() { return messageDe; }
    public void setMessageDe(String messageDe) { this.messageDe = messageDe; }

    public String getMessageFr() { return messageFr; }
    public void setMessageFr(String messageFr) { this.messageFr = messageFr; }
}