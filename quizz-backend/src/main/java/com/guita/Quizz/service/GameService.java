package com.guita.Quizz.service;

import com.guita.Quizz.dto.*;
import com.guita.Quizz.entity.*;
import com.guita.Quizz.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GameService {

    private final PlayerRepository playerRepository;
    private final CategoryRepository categoryRepository;
    private final QuestionRepository questionRepository;
    private final GameRepository gameRepository;
    private final GameQuestionRepository gameQuestionRepository;

    public GameService(PlayerRepository playerRepository,
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

    @Transactional
    public StartGameResponse startGame(StartGameRequest request) {
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new IllegalArgumentException("Player not found: " + request.getPlayerId()));

        Language language = request.getLanguage();
        if (language == null) {
            throw new IllegalArgumentException("Language must not be null");
        }

        if (request.getQuestionsPerCategory() <= 0) {
            throw new IllegalArgumentException("questionsPerCategory must be > 0");
        }

        List<String> categoryNames = request.getCategoryNames();
        if (categoryNames == null || categoryNames.isEmpty()) {
            throw new IllegalArgumentException("categoryNames must not be empty");
        }

        //  Load categories by name + language
        List<Category> categories = categoryRepository.findByLanguageAndNameIn(language, categoryNames);

        if (categories.isEmpty()) {
            throw new IllegalArgumentException(
                    "No categories found for names " + categoryNames + " and language " + language
            );
        }

        Game game = new Game(player);
        game.setLanguage(language);
        game.setStartedAt(LocalDateTime.now());

        List<GameQuestionDto> questionDtos = new ArrayList<>();

        for (Category category : categories) {
            List<Question> questions = questionRepository.findByCategory(category);
            if (questions.isEmpty()) {
                continue;
            }

            Collections.shuffle(questions);
            int limit = Math.min(request.getQuestionsPerCategory(), questions.size());
            List<Question> selected = questions.subList(0, limit);

            for (Question q : selected) {
                GameQuestion gq = new GameQuestion(game, q);
                game.addGameQuestion(gq);
            }
        }

        if (game.getGameQuestions().isEmpty()) {
            throw new IllegalStateException("No questions available for selected categories / language");
        }

        Game savedGame = gameRepository.save(game);

        for (GameQuestion gq : savedGame.getGameQuestions()) {
            Question q = gq.getQuestion();
            List<String> answers = q.getAnswers()
                    .stream()
                    .map(Answer::getText)
                    .toList();

            GameQuestionDto dto = new GameQuestionDto(
                    gq.getId(),
                    q.getId(),
                    q.getText(),
                    answers
            );
            questionDtos.add(dto);
        }

        return new StartGameResponse(savedGame.getId(), questionDtos);
    }

    @Transactional
    public GameResultDto submitAnswers(Long gameId, SubmitAnswersRequest request) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game not found: " + gameId));

        // Load related GameQuestions
        List<GameQuestion> gameQuestions = gameQuestionRepository.findByGame(game);

        Map<Long, GameQuestion> byId = gameQuestions.stream()
                .collect(Collectors.toMap(GameQuestion::getId, gq -> gq));

        // Apply the answers
        for (AnswerSubmissionDto submission : request.getAnswers()) {
            GameQuestion gq = byId.get(submission.getGameQuestionId());
            if (gq == null) {
                continue; // GameQuestion ID unknown → unknown
            }

            Integer chosenIndex = submission.getChosenAnswerIndex();
            gq.setChosenAnswerIndex(chosenIndex);

            Question q = gq.getQuestion();
            Integer correctIndex = q.getCorrectAnswerIndex();

            boolean isCorrect = chosenIndex != null
                    && correctIndex != null
                    && chosenIndex.equals(correctIndex);

            gq.setCorrect(isCorrect);
        }

        // Calcul of the score and update the game
        int totalQuestions = gameQuestions.size();
        int correctAnswers = (int) gameQuestions.stream()
                .filter(gq -> Boolean.TRUE.equals(gq.getCorrect()))
                .count();

        game.setScore(correctAnswers);
        game.setFinishedAt(LocalDateTime.now());

        gameRepository.save(game);

        // etablish the details of each result
        List<QuestionResultDto> details = gameQuestions.stream()
                .map(gq -> {
                    Question q = gq.getQuestion();
                    return new QuestionResultDto(
                            q.getText(),
                            gq.getChosenAnswerIndex(),
                            q.getCorrectAnswerIndex(),
                            gq.getCorrect()
                    );
                })
                .toList();

        GameResultDto result = new GameResultDto(
                game.getId(),
                totalQuestions,
                correctAnswers,
                correctAnswers, // here we use the number of correct answers as the score, but you could apply a different scoring logic if needed
                details
        );

        return result;
    }
}
