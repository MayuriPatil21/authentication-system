
const registerForm = document.getElementById("registerForm");
const message = document.getElementById("message");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    message.textContent = "Registering...";

    try {
        const response = await fetch("/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                email,
                password
            })
        });

        const data = await response.json();

        message.textContent = data.message;

        if (response.ok) {
            message.style.color = "green";
            registerForm.reset();
        } else {
            message.style.color = "red";
        }
    } catch (error) {
        message.style.color = "red";
        message.textContent =
            "Server connection failed. Please try again.";
    }
});
