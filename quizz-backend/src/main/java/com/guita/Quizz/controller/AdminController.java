package com.guita.Quizz.controller;

import com.guita.Quizz.entity.Language;
import com.guita.Quizz.service.ImportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final ImportService importService;

    public AdminController(ImportService importService) {
        this.importService = importService;
    }

    @GetMapping("/ping")
    public String ping() {
        return "Admin API OK";
    }

    @PostMapping("/import-csv")
    public ResponseEntity<String> importForLanguage(@RequestParam Language lang) {
        int count;
        switch (lang) {
            case DE -> count = importService.importQuestionsFromCsv(Language.DE, "data/Wissenstest_sample200.csv");
            case EN -> count = importService.importQuestionsFromCsv(Language.EN, "data/Wissenstest_sample200_EN.csv");
            case FR -> count = importService.importQuestionsFromCsv(Language.FR, "data/Wissenstest_sample200_FR.csv");
            default -> count = 0;
        }
        return ResponseEntity.ok("Import sucessfully " + lang + ". Questions imported : " + count);
    }

    @PostMapping("/import-all")
    public ResponseEntity<String> importAll() {
        int total = importService.importAllLanguages();
        return ResponseEntity.ok("Import completed for all languages. Total questions : " + total);
    }
}
