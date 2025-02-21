// Initialize Supabase with manually added credentials
const supabaseUrl = "https://ugguhkcxvjunmoebtxow.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZ3Voa2N4dmp1bm1vZWJ0eG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NjkwMTQsImV4cCI6MjA1NTQ0NTAxNH0.nvKCwO43yjS6-JQhg7DzUEwEkA14zi7Tw332zMbC_GY"; 

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener("DOMContentLoaded", function () {
    // Handle Login Form Submission
    document.querySelector(".login-form").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent form submission

        // Get user input
        const username = document.querySelector("input[name='username']").value;
        const password = document.querySelector("input[name='password']").value;

        if (!username || !password) {
            alert("⚠ Please enter both username and password.");
            return;
        }

        try {
            // Fetch stored credentials from Supabase
            let { data, error } = await supabase
                .from("admin_credentials")
                .select("password_hash")
                .eq("username", username)
                .single();

            if (error) {
                console.error("Supabase Fetch Error:", error);
                alert(`❌ Supabase Error: ${error.message}`);
                return;
            }

            if (!data) {
                alert("⚠ Invalid username or password.");
                return;
            }

            // Verify password using bcryptjs
            const match = await window.bcrypt.compare(password, data.password_hash);
            if (match) {
                alert("✅ Login successful!");
                window.location.href = "main.html"; // Redirect after successful login
            } else {
                alert("⚠ Invalid username or password.");
            }
        } catch (err) {
            console.error("JavaScript Error:", err);
            alert(`❌ JavaScript Error: ${err.message}`);
        }
    });
});
