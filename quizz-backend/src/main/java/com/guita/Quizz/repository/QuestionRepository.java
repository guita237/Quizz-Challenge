package com.guita.Quizz.repository;

import com.guita.Quizz.entity.Category;
import com.guita.Quizz.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {

    List<Question> findByCategory(Category category);
}
