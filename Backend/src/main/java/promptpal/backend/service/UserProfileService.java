package promptpal.backend.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import promptpal.backend.dto.ProfileUpdateRequest;
import promptpal.backend.entity.User;
import promptpal.backend.repository.UserRepository;

import java.util.Optional;

@Service
public class UserProfileService {

    private static final int MIN_ROUTINE_LENGTH = 100;
    private final UserRepository userRepository;

    @Autowired
    public UserProfileService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Updates the wellness profile and goals for a specific user.
     *
     * @param userId The ID of the user to update.
     * @param request The profile data (metrics and goals).
     * @return The updated User entity.
     * @throws ResponseStatusException if validation fails or user is not found.
     */
    public User updateProfile(Long userId, ProfileUpdateRequest request) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + userId);
        }

        if (request.getDailyRoutine() == null || request.getDailyRoutine().length() < MIN_ROUTINE_LENGTH) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
                "Daily routine is required and must be at least " + MIN_ROUTINE_LENGTH + " characters for best results.");
        }

        User user = userOpt.get();

        // 1. Update Health Metrics
        user.setAge(request.getAge());
        user.setWeight(request.getWeight());
        user.setHeight(request.getHeight());
        user.setAllergies(request.getAllergies());
        user.setDailyRoutine(request.getDailyRoutine());

        // 2. Update Wellness Goals
        user.setSkinType(request.getSkinType());
        user.setHairType(request.getHairType());
        user.setBodyGoal(request.getBodyGoal());

        return userRepository.save(user);
    }
    
    /**
     * Retrieves the current profile data for a user.
     * @param userId The ID of the user.
     * @return The User entity.
     */
    public User getProfile(Long userId) {
         return userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + userId));
    }
}

