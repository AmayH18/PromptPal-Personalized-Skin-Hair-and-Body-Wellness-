package promptpal.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import promptpal.backend.service.GeminiApiClient;

@RestController
public class TestController {

    private final GeminiApiClient geminiApiClient;

    public TestController(GeminiApiClient geminiApiClient) {
        this.geminiApiClient = geminiApiClient;
    }

    @GetMapping("/api/test")
    public String hello() {
        return "✅ PromptPal Backend is running successfully!";
    }

    @GetMapping("/api/test/gemini")
    public String testGemini() {
        return geminiApiClient.getAdvice("Give me a short daily skincare tip for oily skin.");
    }
}
