package com.guita.Quizz.service;

import com.guita.Quizz.entity.Answer;
import com.guita.Quizz.entity.Category;
import com.guita.Quizz.entity.Language;
import com.guita.Quizz.entity.Question;
import com.guita.Quizz.repository.CategoryRepository;
import com.guita.Quizz.repository.QuestionRepository;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class ImportService {

    private final QuestionRepository questionRepository;
    private final CategoryRepository categoryRepository;

    public ImportService(QuestionRepository questionRepository,
                         CategoryRepository categoryRepository) {
        this.questionRepository = questionRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public int importQuestionsFromCsv(Language language, String resourcePath) {
        int importedCount = 0;

        try {
            ClassPathResource resource = new ClassPathResource(resourcePath);

            try (BufferedReader br = new BufferedReader(
                    new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

                // read header
                String line = br.readLine();
                if (line == null) {
                    return 0;
                }

                // cache: (lang + "|" + nomCategorie) -> Category
                Map<String, Category> categoryCache = new HashMap<>();

                while ((line = br.readLine()) != null) {
                    if (line.trim().isEmpty()) {
                        continue;
                    }

                    String[] parts = line.split(";", -1);
                    if (parts.length < 8) {
                        continue;
                    }

                    String questionText = parts[1].trim();
                    String answer1 = parts[2].trim();
                    String answer2 = parts[3].trim();
                    String answer3 = parts[4].trim();
                    String answer4 = parts[5].trim();
                    String correctStr = parts[6].trim();
                    String categoryName = parts[7].trim();

                    if (questionText.isEmpty() || categoryName.isEmpty()) {
                        continue;
                    }

                    int correctIndex;
                    try {
                        correctIndex = Integer.parseInt(correctStr) - 1;
                    } catch (NumberFormatException e) {
                        continue;
                    }

                    if (correctIndex < 0 || correctIndex > 3) {
                        continue;
                    }

                    String key = language.name() + "|" + categoryName;

                    Category category = categoryCache.computeIfAbsent(key, k -> {
                        Category c = new Category();
                        c.setName(categoryName);
                        c.setLanguage(language);
                        return categoryRepository.save(c);
                    });

                    Question q = new Question();
                    q.setText(questionText);
                    q.setCategory(category);

                    List<Answer> answers = new ArrayList<>();
                    answers.add(new Answer(answer1));
                    answers.add(new Answer(answer2));
                    answers.add(new Answer(answer3));
                    answers.add(new Answer(answer4));
                    q.setAnswers(answers);
                    q.setCorrectAnswerIndex(correctIndex);

                    questionRepository.save(q);
                    importedCount++;
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error during CSV import for " + language, e);
        }

        return importedCount;
    }

    @Transactional
    public int importAllLanguages() {
        int total = 0;
        total += importQuestionsFromCsv(Language.DE, "data/Wissenstest_sample200.csv");
        total += importQuestionsFromCsv(Language.EN, "data/Wissenstest_sample200_EN.csv");
        total += importQuestionsFromCsv(Language.FR, "data/Wissenstest_sample200_FR.csv");
        return total;
    }
}
