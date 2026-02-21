package com.guita.Quizz.dto;

import com.guita.Quizz.entity.Language;

public class CategoryDto {
    private Long id;
    private String name;
    private String description;
    private Language language;

    public CategoryDto() {}

    public CategoryDto(Long id, String name, String description, Language language) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.language = language;
    }

    // Getters et Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }
}