package com.guita.Quizz.service;

import com.guita.Quizz.dto.*;
import com.guita.Quizz.entity.*;
import com.guita.Quizz.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class SmartGameService {

    private static final Logger log = LoggerFactory.getLogger(SmartGameService.class);

    private final PlayerRepository playerRepository;
    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;
    private final GameRepository gameRepository;
    private final GameQuestionRepository gameQuestionRepository;

    public SmartGameService(
            PlayerRepository playerRepository,
            CategoryRepository categoryRepository,
            QuestionRepository questionRepository,
            GameRepository gameRepository,
            GameQuestionRepository gameQuestionRepository) {
        this.playerRepository = playerRepository;
        this.categoryRepository = categoryRepository;
        this.questionRepository = questionRepository;
        this.gameRepository = gameRepository;
        this.gameQuestionRepository = gameQuestionRepository;
    }

    public SmartGameConfigResponse startSmartGame(StartGameRequest request) {
        log.info(" Démarrage du SmartGameService...");

        // Verification of settings
        if (request.getPlayerId() == null) {
            throw new IllegalArgumentException("Player ID is null");
        }

        // Player recovery
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new IllegalArgumentException("Player not found with ID: " + request.getPlayerId()));

        log.info(" Joueur trouvé: {}", player.getName());

        Language language = request.getLanguage();
        List<String> categoryNames = request.getCategoryNames();
        int requestedPerCategory = request.getQuestionsPerCategory();

        // Load categories
        List<Category> categories = categoryRepository.findByLanguageAndNameIn(language, categoryNames);

        if (categories.isEmpty()) {
            throw new IllegalArgumentException("No categories found for names " + categoryNames);
        }

        log.info(" Catégories chargées: {}", categories.size());

        // AVAILABILITY ANALYSIS
        Map<Category, Integer> availableQuestionsMap = new HashMap<>();
        Map<Category, List<Question>> questionsByCategory = new HashMap<>();
        int totalAvailable = 0;
        int minAvailable = Integer.MAX_VALUE;

        for (Category category : categories) {
            List<Question> questions = questionRepository.findByCategory(category);
            questionsByCategory.put(category, questions);
            int available = questions.size();
            availableQuestionsMap.put(category, available);
            totalAvailable += available;
            if (available < minAvailable) {
                minAvailable = available;
            }
            log.info("   - {}: {} questions disponibles", category.getName(), available);
        }

        // SMART DECISION
        boolean needsAdjustment = minAvailable < requestedPerCategory;
        Map<String, Integer> distribution = new LinkedHashMap<>();
        int totalQuestions;
        String messageFr;
        String messageEn;
        String messageDe;

        if (needsAdjustment) {
            log.info(" Distribution adaptative nécessaire");

            int maxPossibleTotal = Math.min(totalAvailable, requestedPerCategory * categories.size());

            Map<Category, Integer> finalDistribution = new HashMap<>();

            // Initialize all categories to 0
            for (Category category : categories) {
                finalDistribution.put(category, 0);
            }

            int remainingToAllocate = maxPossibleTotal;
            int maxIterations = 1000;
            int iterations = 0;

            // Fair distribution
            while (remainingToAllocate > 0 && iterations < maxIterations) {
                iterations++;
                boolean allocated = false;

                for (Category category : categories) {
                    if (remainingToAllocate <= 0) break;

                    int current = finalDistribution.get(category);
                    int maxForCategory = availableQuestionsMap.get(category);

                    if (current < maxForCategory && current < requestedPerCategory) {
                        finalDistribution.put(category, current + 1);
                        remainingToAllocate--;
                        allocated = true;
                    }
                }

                if (!allocated) break;
            }

            totalQuestions = finalDistribution.values().stream().mapToInt(Integer::intValue).sum();

            messageFr = String.format(
                    "Distribution adaptative : %d questions au total réparties intelligemment.",
                    totalQuestions
            );

            messageEn = String.format(
                    "Adaptive distribution: %d total questions intelligently allocated.",
                    totalQuestions
            );

            messageDe = String.format(
                    "Adaptive Verteilung: %d Fragen insgesamt intelligent verteilt.",
                    totalQuestions
            );

            for (Map.Entry<Category, Integer> entry : finalDistribution.entrySet()) {
                distribution.put(entry.getKey().getName(), entry.getValue());
            }

        } else {
            log.info(" Distribution normale");
            totalQuestions = requestedPerCategory * categories.size();

            messageFr = String.format(
                    "Configuration validée : %d questions par catégorie. Total: %d questions.",
                    requestedPerCategory, totalQuestions
            );

            messageEn = String.format(
                    "Configuration validated: %d questions per category. Total: %d questions.",
                    requestedPerCategory, totalQuestions
            );

            messageDe = String.format(
                    "Konfiguration validiert: %d Fragen pro Kategorie. Gesamt: %d Fragen.",
                    requestedPerCategory, totalQuestions
            );

            for (Category category : categories) {
                distribution.put(category.getName(), requestedPerCategory);
            }
        }

        // GAME CREATION
        Game game = new Game(player);
        game.setLanguage(language);
        game.setStartedAt(LocalDateTime.now());

        // Create GameQuestions without saving them immediately
        List<GameQuestion> tempGameQuestions = new ArrayList<>();

        for (Category category : categories) {
            List<Question> questions = questionsByCategory.get(category);
            Collections.shuffle(questions);

            int takeCount = distribution.get(category.getName());

            if (takeCount > 0 && takeCount <= questions.size()) {
                List<Question> selected = questions.subList(0, takeCount);

                for (Question q : selected) {
                    GameQuestion gq = new GameQuestion(game, q);
                    tempGameQuestions.add(gq);
                    game.addGameQuestion(gq);
                }
            }
        }

        // Save the game (this also saves cascading GameQuestions)
        Game savedGame = gameRepository.save(game);
        log.info(" Jeu créé avec ID: {}, {} questions", savedGame.getId(), tempGameQuestions.size());

        // Retrieve GameQuestions with their generated IDs
        List<GameQuestion> savedGameQuestions = gameQuestionRepository.findByGame(savedGame);

        // Prepare DTOs with real gameQuestionId
        List<GameQuestionDto> questionDtos = new ArrayList<>();
        for (GameQuestion gq : savedGameQuestions) {
            Question q = gq.getQuestion();
            List<String> answers = q.getAnswers()
                    .stream()
                    .map(Answer::getText)
                    .collect(Collectors.toList());

            GameQuestionDto dto = new GameQuestionDto(
                    gq.getId(),
                    q.getId(),
                    q.getText(),
                    answers
            );
            questionDtos.add(dto);
        }

        SmartGameConfigResponse response = new SmartGameConfigResponse();
        response.setGameId(savedGame.getId());
        response.setRequestedPerCategory(requestedPerCategory);
        response.setActualPerCategory(needsAdjustment ? -1 : requestedPerCategory);
        response.setTotalQuestions(questionDtos.size());
        response.setDistributionPerCategory(distribution);
        response.setQuestions(questionDtos);
        response.setMessageFr(messageFr);
        response.setMessageEn(messageEn);
        response.setMessageDe(messageDe);
        response.setMessage(messageFr);
        response.setAdjusted(needsAdjustment);

        return response;
    }
}