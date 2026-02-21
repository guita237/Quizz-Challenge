package com.guita.Quizz.controller;

import com.guita.Quizz.dto.SmartGameConfigResponse;
import com.guita.Quizz.dto.StartGameRequest;
import com.guita.Quizz.service.SmartGameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/smart-game")
public class SmartGameController {

    private static final Logger log = LoggerFactory.getLogger(SmartGameController.class);
    private final SmartGameService smartGameService;

    public SmartGameController(SmartGameService smartGameService) {
        this.smartGameService = smartGameService;
    }

    @PostMapping("/start")
    public ResponseEntity<SmartGameConfigResponse> startSmartGame(@RequestBody StartGameRequest request) {
        log.info(" Request received on /api/smart-game/start");
        log.info("PlayerId: {}", request.getPlayerId());
        log.info("Language: {}", request.getLanguage());
        log.info("Categories: {}", request.getCategoryNames());
        log.info("Questions per category: {}", request.getQuestionsPerCategory());

        if (request == null) {
            log.error(" Request null");
            return ResponseEntity.badRequest().build();
        }

        if (request.getPlayerId() == null) {
            log.error(" PlayerId null");
            return ResponseEntity.badRequest().build();
        }

        try {
            SmartGameConfigResponse response = smartGameService.startSmartGame(request);
            log.info(" Response successfully generated");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error(" Error during processing: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
}