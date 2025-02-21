const { createClient } = supabase;

// Replace with your Supabase URL and Anonymous Key
const SUPABASE_URL = "https://ugguhkcxvjunmoebtxow.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZ3Voa2N4dmp1bm1vZWJ0eG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NjkwMTQsImV4cCI6MjA1NTQ0NTAxNH0.nvKCwO43yjS6-JQhg7DzUEwEkA14zi7Tw332zMbC_GY";  // Do NOT expose service key in frontend

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

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

    // Verify the password (client-side hash comparison is insecure)
    const valid = await verifyPassword(password, data.password_hash);
    if (!valid) {
        document.getElementById("error-message").innerText = "Invalid username or password.";
        return;
    }

    // If login is successful, redirect
    localStorage.setItem("logged_in", "true");
    window.location.href = "main.html"; // Redirect to the main page
});

// Simple hash verification (For security, handle hashing server-side)
async function verifyPassword(inputPassword, storedHash) {
    return inputPassword === storedHash;  // Ideally use bcrypt.js or similar hashing library
}
