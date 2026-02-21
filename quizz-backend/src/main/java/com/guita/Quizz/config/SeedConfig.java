package com.guita.Quizz.config;

import com.guita.Quizz.service.ImportService;
import com.guita.Quizz.repository.QuestionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedConfig {

    @Bean
    CommandLineRunner seedOnStartup(ImportService importService,
                                    QuestionRepository questionRepository) {
        return args -> {


            if (questionRepository.count() == 0) {
                System.out.println("The database is empty. Starting import...");
                importService.importAllLanguages();
                System.out.println("Import completed successfully.");
            } else {
                System.out.println("The database already contains data. Skipping import.");
            }
        };
    }
}
