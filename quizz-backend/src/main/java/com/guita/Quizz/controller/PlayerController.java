package com.guita.Quizz.controller;

import com.guita.Quizz.dto.CreatePlayerRequest;
import com.guita.Quizz.entity.Player;
import com.guita.Quizz.service.PlayerService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/players")
public class PlayerController {

    private final PlayerService playerService;

    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }

    @GetMapping
    public List<Player> getAll() {
        return playerService.getAllPlayers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Player> getById(@PathVariable Long id) {
        return playerService.getPlayerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/by-name")
    public ResponseEntity<Player> getByName(@RequestParam String name) {
        return playerService.getPlayerByName(name)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }



    @PostMapping
    public Player createOrUpdate(@RequestBody CreatePlayerRequest request) {
        return playerService.createOrUpdatePlayer(request.getName(), null);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        playerService.deletePlayer(id);
        return ResponseEntity.noContent().build();
    }

    // delete all Players
    @DeleteMapping
    public ResponseEntity<Void> deleteAll() {
        playerService.deleteAllPlayers();
        return ResponseEntity.noContent().build();
    }
}
