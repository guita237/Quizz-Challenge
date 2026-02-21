package com.guita.Quizz.service;

import com.guita.Quizz.dto.CategoryDto;
import com.guita.Quizz.entity.Category;
import com.guita.Quizz.entity.Language;
import com.guita.Quizz.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getCategoriesByLanguage(Language language) {
        return categoryRepository.findByLanguage(language);
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }

    public Category createOrGet(String name, String description, Language language) {

        return categoryRepository.findByName(name)
                .orElseGet(() -> {
                    Category c = new Category();
                    c.setName(name);
                    c.setDescription(description);
                    c.setLanguage(language);
                    return categoryRepository.save(c);
                });
    }
    public List<CategoryDto> getCategoriesDtoByLanguage(Language language) {
        return categoryRepository.findByLanguage(language)
                .stream()
                .map(c -> new CategoryDto(c.getId(), c.getName(), c.getDescription(), c.getLanguage()))
                .toList();
    }

    public Category create(Category category) {
        return categoryRepository.save(category);
    }
}
