function checkHealth() {

    let height = document.getElementById("height").value / 100;
    let weight = document.getElementById("weight").value;
    let activity = document.getElementById("activity").value;

    let bmi = weight / (height * height);

    let score = 100;

    if (bmi > 25) score -= 20;

    if (activity === "Sedentary")
        score -= 20;

    let advice = score < 80
        ? "Walk 30 minutes daily"
        : "Keep up the good work!";

    document.getElementById("result").innerHTML =
        `BMI: ${bmi.toFixed(1)}<br>
         Health Score: ${score}/100<br>
         Advice: ${advice}`;
}