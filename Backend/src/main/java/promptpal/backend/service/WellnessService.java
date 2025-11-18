package promptpal.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import promptpal.backend.entity.User;
import promptpal.backend.entity.UserResult;
import promptpal.backend.repository.UserRepository;
import promptpal.backend.repository.UserResultRepository;
import promptpal.backend.service.GeminiApiClient;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class WellnessService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserResultRepository userResultRepository;

    @Autowired
    private GeminiApiClient geminiApiClient;

    public String generateAdvice(Long userId, String type) {

        Optional<User> opt = userRepository.findById(userId);
        if (opt.isEmpty()) return "User not found";

        User user = opt.get();

        // Build AI prompt
        String prompt = switch (type) {
            case "SKIN" ->
                    "Give personalized skincare advice for: skin=" + user.getSkinType() +
                            ", allergies=" + user.getAllergies();
            case "HAIR" ->
                    "Give personalized haircare advice for: hair=" + user.getHairType();
            case "BODY" ->
                    "Give personalized fitness/body advice for goal: " + user.getBodyGoal();
            default -> "Unknown advice type";
        };

        // Call Gemini
        String response = geminiApiClient.getAdvice(prompt);

        // Save result history
        UserResult result = new UserResult();
        result.setUser(user);
        result.setAdviceType(type);
        result.setAiResponse(response);
        result.setGenerationTime(LocalDateTime.now());


        userResultRepository.save(result);

        return response;
    }
}
