package promptpal.backend.dto;

public class ProfileUpdateRequest {
	private int age;
    private double height; // in cm
    private double weight; // in kg
    private String allergies; // optional
    private String dailyRoutine; // min 100 chars

    // Wellness Goals
    private String skinType; // e.g., dry, oily, balanced
    private String hairType; // e.g., dry, less moisture
    private String bodyGoal; // e.g., gaining, maintenance, cut

    // --- Getters and Setters ---
    
    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getDailyRoutine() {
        return dailyRoutine;
    }

    public void setDailyRoutine(String dailyRoutine) {
        this.dailyRoutine = dailyRoutine;
    }

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



