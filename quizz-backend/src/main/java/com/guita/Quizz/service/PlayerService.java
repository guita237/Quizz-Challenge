package com.guita.Quizz.service;

import com.guita.Quizz.entity.Player;
import com.guita.Quizz.repository.PlayerRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    private final PlayerRepository playerRepository;

    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<Player> getAllPlayers() {
        return playerRepository.findAll();
    }

    public Optional<Player> getPlayerById(Long id) {
        return playerRepository.findById(id);
    }

    public Optional<Player> getPlayerByName(String name) {
        return playerRepository.findByName(name);
    }

    public Player createOrUpdatePlayer(String name, LocalDate birthDate) {
        // Si le joueur existe déjà, on met à jour la date de naissance
        return playerRepository.findByName(name)
                .map(existing -> {
                    existing.setBirthDate(birthDate);
                    return playerRepository.save(existing);
                })
                .orElseGet(() -> {
                    Player p = new Player(name, birthDate);
                    return playerRepository.save(p);
                });
    }

    public void deletePlayer(Long id) {
        playerRepository.deleteById(id);
    }

    // delete all player and reset Id
    public void deleteAllPlayers() {
        playerRepository.deleteAll();
    }

}
