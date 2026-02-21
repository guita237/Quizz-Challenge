package com.guita.Quizz.service;

import com.guita.Quizz.entity.Category;
import com.guita.Quizz.entity.Question;
import com.guita.Quizz.repository.QuestionRepository;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    public QuestionService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public int countByCategory(Category category) {
        return questionRepository.findByCategory(category).size();
    }
}