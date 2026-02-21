package com.guita.Quizz.repository;

import com.guita.Quizz.entity.GameQuestion;
import com.guita.Quizz.entity.Game;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameQuestionRepository extends JpaRepository<GameQuestion, Long> {

    List<GameQuestion> findByGame(Game game);
}
