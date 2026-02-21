package com.guita.Quizz.dto;

import java.util.List;
import java.util.Map;

public class SmartGameConfigResponse {
    private Long gameId;
    private int requestedPerCategory;
    private int actualPerCategory;
    private int totalQuestions;
    private Map<String, Integer> distributionPerCategory;
    private List<GameQuestionDto> questions;
    private String message;
    private String messageEn;
    private String messageDe;
    private String messageFr;
    private boolean adjusted;

    // Constructeurs
    public SmartGameConfigResponse() {}

    // Getters et Setters
    public Long getGameId() { return gameId; }
    public void setGameId(Long gameId) { this.gameId = gameId; }

    public int getRequestedPerCategory() { return requestedPerCategory; }
    public void setRequestedPerCategory(int requestedPerCategory) { this.requestedPerCategory = requestedPerCategory; }

    public int getActualPerCategory() { return actualPerCategory; }
    public void setActualPerCategory(int actualPerCategory) { this.actualPerCategory = actualPerCategory; }

    public int getTotalQuestions() { return totalQuestions; }
    public void setTotalQuestions(int totalQuestions) { this.totalQuestions = totalQuestions; }

    public Map<String, Integer> getDistributionPerCategory() { return distributionPerCategory; }
    public void setDistributionPerCategory(Map<String, Integer> distributionPerCategory) { this.distributionPerCategory = distributionPerCategory; }

    public List<GameQuestionDto> getQuestions() { return questions; }
    public void setQuestions(List<GameQuestionDto> questions) { this.questions = questions; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getMessageEn() { return messageEn; }
    public void setMessageEn(String messageEn) { this.messageEn = messageEn; }

    public String getMessageDe() { return messageDe; }
    public void setMessageDe(String messageDe) { this.messageDe = messageDe; }

    public String getMessageFr() { return messageFr; }
    public void setMessageFr(String messageFr) { this.messageFr = messageFr; }

    public boolean isAdjusted() { return adjusted; }
    public void setAdjusted(boolean adjusted) { this.adjusted = adjusted; }
}