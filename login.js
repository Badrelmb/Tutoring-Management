// Ensure Supabase is properly initialized
const supabase = window.supabase.createClient(
    "https://ugguhkcxvjunmoebtxow.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZ3Voa2N4dmp1bm1vZWJ0eG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NjkwMTQsImV4cCI6MjA1NTQ0NTAxNH0.nvKCwO43yjS6-JQhg7DzUEwEkA14zi7Tw332zMbC_GY"
);

// Debugging Log: Check if Supabase loaded
console.log("✅ Supabase initialized:", supabase);

// Ensure DOM is fully loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    if (!loginForm) {
        console.error("❌ Login form not found in the DOM!");
        return;
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!username || !password) {
            document.getElementById("error-message").innerText = "Please enter both username and password.";
            return;
        }

        // Fetch the stored hashed password from Supabase
        let { data, error } = await supabase
            .from("admin_credentials")
            .select("password_hash")
            .eq("username", username)
            .single();

        if (error || !data) {
            document.getElementById("error-message").innerText = "Invalid username or password.";
            return;
        }

        // Verify the password using bcrypt.js
        const valid = await bcrypt.compare(password, data.password_hash);
        if (!valid) {
            document.getElementById("error-message").innerText = "Invalid username or password.";
            return;
        }

        // If login is successful, store session and redirect
        localStorage.setItem("logged_in", "true");
        window.location.href = "main.html"; // Redirect to main page
    });
});
