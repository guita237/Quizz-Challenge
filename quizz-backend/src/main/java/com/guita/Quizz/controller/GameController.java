package com.guita.Quizz.controller;

import com.guita.Quizz.dto.GameResultDto;
import com.guita.Quizz.dto.StartGameRequest;
import com.guita.Quizz.dto.StartGameResponse;
import com.guita.Quizz.dto.SubmitAnswersRequest;
import com.guita.Quizz.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/start")
    public ResponseEntity<StartGameResponse> startGame(@RequestBody StartGameRequest request) {
        StartGameResponse response = gameService.startGame(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{gameId}/submit")
    public ResponseEntity<GameResultDto> submitAnswers(
            @PathVariable Long gameId,
            @RequestBody SubmitAnswersRequest request) {

        GameResultDto result = gameService.submitAnswers(gameId, request);
        return ResponseEntity.ok(result);
    }
}
