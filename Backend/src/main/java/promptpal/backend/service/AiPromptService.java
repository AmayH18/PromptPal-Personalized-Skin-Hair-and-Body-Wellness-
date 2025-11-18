package promptpal.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import promptpal.backend.dto.AiAdviceRequest;
import promptpal.backend.entity.User;
import promptpal.backend.entity.UserResult;
import promptpal.backend.repository.UserRepository;
import promptpal.backend.repository.UserResultRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service dedicated to fetching user data, building customized AI prompts,
 * calling the Gemini API, and storing the resulting advice.
 */
@Service
public class AiPromptService {

    private final UserRepository userRepository;
    
    private final UserProfileService profileService;
    private final GeminiApiClient geminiApiClient; // <-- 1. NEW: Dependency for AI call
    
    @Autowired
    private UserResultRepository userResultRepository;


    @Autowired
    public AiPromptService(
            UserRepository userRepository, 
            UserResultRepository userResultRepository, 
            UserProfileService profileService,
            GeminiApiClient geminiApiClient) { // <-- 1. Inject the GeminiApiClient
        this.userRepository = userRepository;
        this.userResultRepository = userResultRepository;
        this.profileService = profileService;
        this.geminiApiClient = geminiApiClient;
    }
    
    public UserProfileService getProfileService() {
        return profileService;
    }

    /**
     * Fetches user data, builds the prompt, calls the Gemini API, and saves the result.
     *
     * @param userId The user ID requesting the advice.
     * @param request The type of advice requested (SKIN, HAIR, BODY).
     * @return The newly generated UserResult object.
     */
    public UserResult generateAndSaveAdvice(Long userId, AiAdviceRequest request) {
        User user = profileService.getProfile(userId);

        String adviceType = request.getAdviceType();
        if (!List.of("SKIN", "HAIR", "BODY").contains(adviceType)) {
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid advice type requested. Must be SKIN, HAIR, or BODY.");
        }
        
        // 1. Build the customized prompt
        String fullPrompt = buildCustomPrompt(user, adviceType);

        // 2. CALL THE REAL GEMINI API
        String aiResponse = geminiApiClient.getAdvice(fullPrompt); // <-- 2. Replaced mock call
        
        // Check if the API call returned an error message (as formatted in GeminiApiClient)
        if (aiResponse.startsWith("Error:")) {
             // Pass the error message directly to the client as an Internal Server Error
             throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "AI Advice Generation Failed: " + aiResponse);
        }
        
        // 3. Save the result
        UserResult result = new UserResult();
        result.setUser(user);
        result.setAdviceType(adviceType);
        result.setPromptUsed(fullPrompt);
        result.setAiResponse(aiResponse);
        result.setGenerationTime(LocalDateTime.now());

        return userResultRepository.save(result);
    }

    /**
     * Fetches the history of advice results for a user.
     * @param userId The user ID.
     * @return List of past UserResult objects.
     */
    public List<UserResult> getAdviceHistory(Long userId) {
        profileService.getProfile(userId); // Reuses the validation logic for user existence
        return userResultRepository.findByUser_IdOrderByGenerationTimeDesc(userId);


    }

    /**
     * Constructs the highly personalized prompt string using high-level prompt engineering.
     */
    public String buildCustomPrompt(User user, String adviceType) {
        StringBuilder promptBuilder = new StringBuilder();
        String allergies = user.getAllergies() != null && !user.getAllergies().isEmpty() ? user.getAllergies().toUpperCase() : "NONE";

        // --- 1. SYSTEM INSTRUCTION / PERSONA ---
        promptBuilder.append("You are 'PromptPal AI', a world-class, certified wellness specialist. ");
        promptBuilder.append("Your primary goal is to provide a comprehensive, actionable, and personalized plan. ");
        promptBuilder.append("Responses must be structured strictly in **Markdown** with clear headings, bold text, and bullet points.\n\n");
        
        // --- 2. CRITICAL CONSTRAINTS (ALLERGIES & ROUTINE) ---
        promptBuilder.append("### CRITICAL CONSTRAINTS:\n");
        promptBuilder.append("- **ALLERGY EXCLUSION:** ABSOLUTELY DO NOT recommend any food, ingredient, or product containing the following allergens: **").append(allergies).append("**.\n");
        promptBuilder.append("- **FEASIBILITY:** The recommended plan must be realistically integrated into the user's existing daily routine.\n\n");


        // --- 3. USER DATA CONTEXT BLOCK ---
        promptBuilder.append("### USER FULL PROFILE DATA:\n");
        promptBuilder.append("- Age: ").append(user.getAge()).append(" years\n");
        promptBuilder.append("- Weight: ").append(user.getWeight()).append(" kg\n");
        promptBuilder.append("- Height: ").append(user.getHeight()).append(" cm\n");
        promptBuilder.append("- Skin Type: **").append(user.getSkinType()).append("**\n");
        promptBuilder.append("- Hair Type: **").append(user.getHairType()).append("**\n");
        promptBuilder.append("- Body Goal: **").append(user.getBodyGoal()).append("**\n");
        promptBuilder.append("- Daily Routine: ").append(user.getDailyRoutine()).append("\n\n");
        
        // --- 4. SPECIFIC GOAL DEFINITION AND REQUIRED OUTPUT ---
        promptBuilder.append("### ADVICE GENERATION TASK: (Focus: ").append(adviceType).append(")\n");

        switch (adviceType) {
            case "SKIN":
                promptBuilder.append("Task: Generate a **5-Step Daily Personalized Skincare Routine** (AM and PM) for the next 14 days. Include product ingredient suggestions that specifically target the user's **").append(user.getSkinType()).append("** type and age. Address any routine elements (diet, sleep, stress from routine) that could be negatively impacting their skin health.\n");
                promptBuilder.append("REQUIRED SECTIONS: Rationale, AM Routine (5 Steps), PM Routine (5 Steps), Lifestyle Adjustments.\n");
                break;
            case "HAIR":
                promptBuilder.append("Task: Generate a comprehensive Hair Health Plan. Identify the root cause of the **").append(user.getHairType()).append("** condition. Provide a washing schedule, mask recipes, and **internal (dietary)** recommendations. Ensure the recommendations are safe given the user's allergies.\n");
                promptBuilder.append("REQUIRED SECTIONS: Condition Analysis, Weekly Regimen, Dietary Changes, Product Recommendations.\n");
                break;
            case "BODY":
                promptBuilder.append("Task: Generate a plan to achieve the **").append(user.getBodyGoal()).append("** goal. FIRST: Calculate the estimated **BMI and BMR** based on the provided metrics. SECOND: Provide a specific, achievable calorie target (net of deficit/surplus). THIRD: Create a 3-day sample workout schedule that integrates seamlessly with the user's existing daily routine.\n");
                promptBuilder.append("REQUIRED SECTIONS: Health Metrics Summary (BMI/BMR), Caloric Goal, Sample Fitness Schedule (3 days), Nutrition Quick-Tips (Allergy Checked).\n");
                break;
            default:
                // The controller should prevent other types, but this is a good safety net.
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid advice type requested.");
        }
        
        return promptBuilder.toString();
    }
}