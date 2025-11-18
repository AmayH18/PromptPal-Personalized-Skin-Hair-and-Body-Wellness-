package promptpal.backend.entity;
import java.time.Instant;

import jakarta.persistence.*;  // JPA annotations
@Entity
@Table(name = "users") // Database table name

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment ID
    private Long id;

    @Column(nullable =false, unique = true)
    private String username;

    @Column(nullable =false)
    private String password;

    @Column(nullable =false, unique = true)
    private String email;

    @Column(nullable = false, unique = true)
    private String phone;
    @Column
    private Instant otpExpiry;


    @Column
    private int age;

    @Column
    private double height; // in cm

    @Column
    private double weight; // in kg

    @Column
    private String allergies; // optional

    @Column(length = 500)
    private String dailyRoutine; // optional, min 100 chars recommended

    // --- NEW WELLNESS GOALS FIELDS ---
    @Column
    private String skinType;

    @Column
    private String hairType;

    @Column
    private String bodyGoal;
    // ---------------------------------
    
    @Column
    private String otp;

    // -------------- GETTERS AND SETTERS ----------------

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public double getHeight() { return height; }
    public void setHeight(double height) { this.height = height; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getDailyRoutine() { return dailyRoutine; }
    public void setDailyRoutine(String dailyRoutine) { this.dailyRoutine = dailyRoutine;}

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    public Instant getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(Instant otpExpiry) {
        this.otpExpiry = otpExpiry;
    }


    // --- NEW WELLNESS GOALS GETTERS/SETTERS ---

    public String getSkinType() {
        return skinType;
    }

    public void setSkinType(String skinType) {
        this.skinType = skinType;
    }

    public String getHairType() {
        return hairType;
    }

    public void setHairType(String hairType) {
        this.hairType = hairType;
    }

    public String getBodyGoal() {
        return bodyGoal;
    }

    public void setBodyGoal(String bodyGoal) {
        this.bodyGoal = bodyGoal;
    }
}

	


