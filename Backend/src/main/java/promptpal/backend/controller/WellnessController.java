package promptpal.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import promptpal.backend.dto.AiAdviceRequest;
import promptpal.backend.entity.UserResult;
import promptpal.backend.entity.User; // <-- ADDED IMPORT FOR USER ENTITY
import promptpal.backend.service.AiPromptService;
import promptpal.backend.service.WellnessService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for generating AI wellness advice and retrieving history.
 */

@RestController
@RequestMapping("/api/wellness")
public class WellnessController {

    private final AiPromptService aiPromptService;
    @Autowired
    private WellnessService wellnessService;


    @Autowired
    public WellnessController(AiPromptService aiPromptService) {
        this.aiPromptService = aiPromptService;
    }

    /**
     * Generates new personalized advice based on user profile and saves the result.
     *
     * @param userId The ID of the user requesting the advice.
     * @param request The advice type (SKIN, HAIR, BODY).
     * @return The generated advice result.
     */
    @PostMapping("/advice/{userId}")
    public ResponseEntity<UserResult> generateAdvice(
            @PathVariable Long userId,
            @RequestBody AiAdviceRequest request) {

        // The service layer handles prompt creation, API call (mocked here), and saving
        UserResult result = aiPromptService.generateAndSaveAdvice(userId, request);
        
        // Hide sensitive prompt data from the response body for a cleaner output
        result.setPromptUsed("Prompt generated successfully (stored in DB).");
        
        return ResponseEntity.ok(result);
    }

    /**
     * Retrieves the history of all previously generated advice for a user.
     *
     * @param userId The ID of the user.
     * @return A list of past UserResult objects.
     */
    @GetMapping("/history/{userId}")
    public ResponseEntity<List<UserResult>> getHistory(@PathVariable Long userId) {
        List<UserResult> history = aiPromptService.getAdviceHistory(userId);
        
        // Optionally clean up the response data before sending
        history.forEach(r -> r.setPromptUsed("Prompt used is available in DB."));
        
        return ResponseEntity.ok(history);
    }
    
    @PostMapping("/multi-advice/{userId}")
    public ResponseEntity<?> generateMultiple(
            @PathVariable Long userId,
            @RequestBody Map<String, Boolean> request
    ) {

        boolean skin = request.getOrDefault("skin", false);
        boolean hair = request.getOrDefault("hair", false);
        boolean body = request.getOrDefault("body", false);

        Map<String, String> responses = new HashMap<>();

        if (skin)
            responses.put("skin", wellnessService.generateAdvice(userId, "SKIN"));

        if (hair)
            responses.put("hair", wellnessService.generateAdvice(userId, "HAIR"));

        if (body)
            responses.put("body", wellnessService.generateAdvice(userId, "BODY"));

        return ResponseEntity.ok(responses);
    }

    
    /**
     * Endpoint to expose the full prompt for debugging purposes (optional).
     * @param userId The user ID.
     * @param request The advice type.
     * @return The generated prompt string.
     */
    @PostMapping("/prompt-preview/{userId}")
    public ResponseEntity<Map<String, String>> previewPrompt(
        @PathVariable Long userId,
        @RequestBody AiAdviceRequest request) {
        
        // Reuses the validation logic
        User user = aiPromptService.getProfileService().getProfile(userId);
        
        String prompt = aiPromptService.buildCustomPrompt(user, request.getAdviceType());
        
        return ResponseEntity.ok(Map.of("adviceType", request.getAdviceType(), "generatedPrompt", prompt));
    }
}
