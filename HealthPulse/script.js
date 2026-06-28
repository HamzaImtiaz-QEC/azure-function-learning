function checkHealth() {

    let gender = document.getElementById("gender").value;
    let age = Number(document.getElementById("age").value);
    let feet = Number(document.getElementById("feet").value);
    let inches = Number(document.getElementById("inches").value);
    let weight = Number(document.getElementById("weight").value);
    let sleep = Number(document.getElementById("sleep").value);
    let water = Number(document.getElementById("water").value);
    let smoking = document.getElementById("smoking").value;
    let stress = document.getElementById("stress").value;
    let screen = Number(document.getElementById("screen").value);
    let activity = document.getElementById("activity").value;

    // Height conversion
    let totalInches = (feet * 12) + inches;
    let heightMeters = totalInches * 0.0254;

    // BMI
    let bmi = weight / (heightMeters * heightMeters);

    let bmiCategory = "";

    if (bmi < 18.5)
        bmiCategory = "Underweight";
    else if (bmi < 25)
        bmiCategory = "Normal";
    else if (bmi < 30)
        bmiCategory = "Overweight";
    else
        bmiCategory = "Obese";

    // Health Score
    let score = 100;

    // BMI
    if (bmi > 25)
        score -= 20;

    // Age
    if (age > 50)
        score -= 10;

    // Sleep
    if (sleep < 7)
        score -= 10;

    // Water
    if (water < 6)
        score -= 10;

    // Smoking
    if (smoking === "yes")
        score -= 25;

    // Stress
    if (stress === "medium")
        score -= 10;
    else if (stress === "high")
        score -= 20;

    // Screen Time
    if (screen > 10)
        score -= 15;
    else if (screen > 6)
        score -= 5;

    // Activity
    if (activity === "sedentary")
        score -= 20;
    else if (activity === "light")
        score -= 10;
    else if (activity === "very")
        score += 5;
    else if (activity === "extreme")
        score += 10;

    // Prevent negative score
    if (score < 0)
        score = 0;

    // Health Status
    let healthLevel = "";

    if (score >= 90)
        healthLevel = "Excellent 🟢";
    else if (score >= 70)
        healthLevel = "Good 🟡";
    else if (score >= 50)
        healthLevel = "Moderate 🟠";
    else
        healthLevel = "High Risk 🔴";

    // Recommendations
    let advice = [];

    if (bmi > 25)
        advice.push("Walk at least 30 minutes daily");

    if (sleep < 7)
        advice.push("Sleep at least 7 hours");

    if (water < 6)
        advice.push("Increase water intake");

    if (smoking === "yes")
        advice.push("Consider quitting smoking");

    if (stress === "high")
        advice.push("Practice stress management techniques");

    if (screen > 10)
        advice.push("Reduce daily screen time");

    if (activity === "sedentary")
        advice.push("Add regular physical activity");

    if (advice.length === 0)
        advice.push("Keep up the good work!");

    document.getElementById("result").innerHTML = `
        <h3>Health Report</h3>

        <b>Gender:</b> ${gender}<br>
        <b>Age:</b> ${age}<br>
        <b>BMI:</b> ${bmi.toFixed(1)} (${bmiCategory})<br>
        <b>Health Score:</b> ${score}/100<br>
        <b>Status:</b> ${healthLevel}<br><br>

        <b>Recommendations:</b><br>
        ${advice.join("<br>")}
    `;
}
function resetForm() {

    document.getElementById("gender").value = "male";
    document.getElementById("age").value = "";
    document.getElementById("feet").value = "";
    document.getElementById("inches").value = "";
    document.getElementById("weight").value = "";
    document.getElementById("sleep").value = "";
    document.getElementById("water").value = "";
    document.getElementById("smoking").value = "no";
    document.getElementById("stress").value = "low";
    document.getElementById("screen").value = "";
    document.getElementById("activity").value = "sedentary";

    document.getElementById("result").innerHTML = "";
}

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

}

function downloadReport() {

    let report = document.getElementById("result").innerText;

    if (report === "") {
        alert("Please generate a health report first.");
        return;
    }

    let blob = new Blob([report], { type: "text/plain" });

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "health_report.txt";

    link.click();

}