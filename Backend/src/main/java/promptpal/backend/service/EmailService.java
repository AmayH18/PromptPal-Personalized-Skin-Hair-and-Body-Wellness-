package promptpal.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Service
public class EmailService {

    @Value("${resend.api.key}")
    private String apiKey;

    @Value("${mail.from}")
    private String fromEmail;

    private final WebClient webClient = WebClient.create("https://api.resend.com");

    public boolean sendOtpEmail(String to, String subject, String otp) {
        try {
            String htmlContent = buildHtmlOtpTemplate(otp);

            Map<String, Object> payload = Map.of(
                    "from", fromEmail,
                    "to", to,
                    "subject", subject,
                    "html", htmlContent
            );

            Map response = webClient.post()
                    .uri("/emails")
                    .header("Authorization", "Bearer " + apiKey)
                    .bodyValue(payload)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .block();

            System.out.println("📨 RESEND Response: " + response);
            return true;

        } catch (Exception e) {
            System.err.println("❌ Resend Email Error: " + e.getMessage());
            return false;
        }
    }

    private String buildHtmlOtpTemplate(String otp) {

        String html = ""
            + "<div style='font-family: Arial, sans-serif; background: #f4f4f7; padding: 30px;'>"
            + "  <div style='max-width: 500px; margin: auto; background: white; border-radius: 12px; padding: 25px;"
            + "              box-shadow: 0 4px 12px rgba(0,0,0,0.1);'>"

            + "    <h2 style='text-align: center; color: #5a3be7;'>🌟 PROMPTPAL</h2>"

            + "    <p style='font-size: 15px; color: #333;'>"
            + "        Hi there,<br><br>"
            + "        Use the OTP below to reset your PromptPal account password."
            + "    </p>"

            + "    <div style='text-align: center; margin: 25px 0;'>"
            + "        <div style='display: inline-block; background: #5a3be7; color: white;"
            + "                    padding: 15px 40px; font-size: 26px;"
            + "                    border-radius: 10px; letter-spacing: 4px; font-weight: bold;'>"
            +              otp
            + "        </div>"
            + "    </div>"

            + "    <p style='font-size: 14px; color: #555;'>"
            + "        This OTP is valid for <b>10 minutes</b>.<br>"
            + "        If you didn’t request this, you can safely ignore this email."
            + "    </p>"

            + "    <hr style='border: none; border-top: 1px solid #eee; margin: 20px 0;'>"

            + "    <p style='font-size: 12px; text-align: center; color: #aaa;'>"
            + "        © " + java.time.Year.now() + " PromptPal — Personalized AI Wellness Assistant"
            + "    </p>"

            + "  </div>"
            + "</div>";

        return html;
    }
}
