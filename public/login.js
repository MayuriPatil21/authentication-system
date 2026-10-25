
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.style.color = "#333";
    message.textContent = "Logging in...";

    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            message.style.color = "red";
            message.textContent = data.message || "Login failed";
            return;
        }

        // Store the JWT token for this demo
        sessionStorage.setItem("authToken", data.token);
        sessionStorage.setItem("username", data.username);

        message.style.color = "green";
        message.textContent = "Login successful!";

        // Open the protected dashboard
        window.location.href = "/dashboard.html";
    } catch (error) {
        message.style.color = "red";
        message.textContent =
            "Server connection failed. Please try again.";
    }
});
