package com.guita.Quizz.controller;

import com.guita.Quizz.dto.CategoryDto;
import com.guita.Quizz.dto.CategoryQuestionCountDto;
import com.guita.Quizz.dto.QuestionAvailabilityResponse;
import com.guita.Quizz.entity.Category;
import com.guita.Quizz.entity.Language;
import com.guita.Quizz.service.CategoryService;
import com.guita.Quizz.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categories")

public class CategoryController {

    private final CategoryService categoryService;
    private final QuestionService questionService;

    public CategoryController(CategoryService categoryService, QuestionService questionService) {
        this.categoryService = categoryService;
        this.questionService = questionService;
    }

    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getById(@PathVariable Long id) {
        return categoryService.getCategoryById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.create(category);
    }

    @GetMapping("/by-language-dto")
    public List<CategoryDto> getByLanguageDto(@RequestParam Language lang) {
        List<Category> categories = categoryService.getCategoriesByLanguage(lang);

        return categories.stream()
                .map(c -> new CategoryDto(
                        c.getId(),
                        c.getName(),
                        c.getDescription(),
                        c.getLanguage()
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/by-language")
    public List<Category> getByLanguage(@RequestParam Language lang) {
        return categoryService.getCategoriesByLanguage(lang);
    }

    @PostMapping("/check-availability")
    public ResponseEntity<QuestionAvailabilityResponse> checkQuestionAvailability(
            @RequestParam Language lang,
            @RequestBody List<String> categoryNames,
            @RequestParam int requestedPerCategory) {

        List<Category> categories = categoryService.getCategoriesByLanguage(lang)
                .stream()
                .filter(c -> categoryNames.contains(c.getName()))
                .collect(Collectors.toList());

        List<CategoryQuestionCountDto> availability = categories.stream()
                .map(cat -> {
                    int available = questionService.countByCategory(cat);
                    CategoryQuestionCountDto dto = new CategoryQuestionCountDto(
                            cat.getId(),
                            cat.getName(),
                            cat.getLanguage(),
                            available
                    );
                    dto.setRequestedQuestions(requestedPerCategory);
                    dto.setSufficient(available >= requestedPerCategory);
                    return dto;
                })
                .collect(Collectors.toList());

        boolean allAvailable = availability.stream().allMatch(CategoryQuestionCountDto::isSufficient);

        return ResponseEntity.ok(new QuestionAvailabilityResponse(allAvailable, availability, lang));
    }
}