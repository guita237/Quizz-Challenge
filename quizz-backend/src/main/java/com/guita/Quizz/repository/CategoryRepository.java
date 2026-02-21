package com.guita.Quizz.repository;

import com.guita.Quizz.entity.Category;
import com.guita.Quizz.entity.Language;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByName(String name);

    List<Category> findByLanguage(Language language);


    List<Category> findByLanguageAndNameIn(Language language, List<String> names);
}
