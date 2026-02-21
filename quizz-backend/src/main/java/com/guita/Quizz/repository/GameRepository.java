package com.guita.Quizz.repository;

import com.guita.Quizz.entity.Game;
import com.guita.Quizz.entity.Player;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GameRepository extends JpaRepository<Game, Long> {

    List<Game> findByPlayer(Player player);
}
