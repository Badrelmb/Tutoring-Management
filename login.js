// Initialize Supabase
const supabaseUrl = "https://ugguhkcxvjunmoebtxow.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZ3Voa2N4dmp1bm1vZWJ0eG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NjkwMTQsImV4cCI6MjA1NTQ0NTAxNH0.nvKCwO43yjS6-JQhg7DzUEwEkA14zi7Tw332zMbC_GY"; 

const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

// Handle Login
document.querySelector(".login-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get user input
    const username = document.querySelector("input[name='username']").value;
    const password = document.querySelector("input[name='password']").value;

    // Fetch stored credentials from Supabase
    let { data, error } = await supabase
        .from("admin_credentials")
        .select("password_hash")
        .eq("username", username)
        .single();

    if (error || !data) {
        alert("Invalid username or password.");
        return;
    }

    // Verify password using bcrypt.js
    const match = await bcrypt.compare(password, data.password_hash);

    if (match) {
        alert("Login successful!");
        window.location.href = "main.html"; // Redirect to your dashboard
    } else {
        alert("Invalid username or password.");
    }
});
