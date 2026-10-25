
const welcomeMessage = document.getElementById("welcomeMessage");
const statusMessage = document.getElementById("statusMessage");
const logoutButton = document.getElementById("logoutButton");

const token = sessionStorage.getItem("authToken");

if (!token) {
    window.location.replace("/login.html");
} else {
    checkProfile();
}

async function checkProfile() {
    try {
        const response = await fetch("/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            sessionStorage.removeItem("authToken");
            sessionStorage.removeItem("username");
            window.location.replace("/login.html");
            return;
        }

        welcomeMessage.textContent =
            `Welcome, ${sessionStorage.getItem("username") || "User"}!`;

        statusMessage.textContent = data.message;
    } catch (error) {
        statusMessage.textContent =
            "Unable to connect to the server. Please try again.";
    }
}

logoutButton.addEventListener("click", async () => {
    logoutButton.disabled = true;

    try {
        const response = await fetch("/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            statusMessage.textContent = data.message || "Logout failed";
            logoutButton.disabled = false;
            return;
        }

        sessionStorage.removeItem("authToken");
        sessionStorage.removeItem("username");

        window.location.replace("/login.html");
    } catch (error) {
        statusMessage.textContent =
            "Unable to connect. Please try again.";
        logoutButton.disabled = false;
    }
});
