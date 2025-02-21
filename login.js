// Initialize Supabase with manually added credentials
const supabaseUrl = "https://ugguhkcxvjunmoebtxow.supabase.co"; 
const supabaseAnonKey = "your_actual_anon_key";

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener("DOMContentLoaded", function () {
    // Handle Login Form Submission
    document.querySelector(".login-form").addEventListener("submit", async (event) => {
        event.preventDefault(); // Prevent form submission

        // Get user input
        const username = document.querySelector("input[name='username']").value;
        const password = document.querySelector("input[name='password']").value;

        if (!username || !password) {
            alert("Please enter both username and password.");
            return;
        }

        // Fetch stored credentials from Supabase
        let { data, error } = await supabase
            .from("admin_credentials")
            .select("password_hash")
            .eq("username", username)
            .single();

        if (error || !data) {
           alert("❌ Error fetching data. Please try again.");
            return;
        }

        if (!data) {
                alert("⚠ Invalid username or password.");
                return;
            }

        try {
    let { data, error } = await supabase
        .from("admin_credentials")
        .select("*");  // Fetch all data for debugging

    console.log("Supabase Data:", data); // Debugging
    alert(JSON.stringify(data)); // Show data to confirm

    if (error) {
        console.error("Supabase Fetch Error:", error);
        alert(`❌ Supabase Error: ${error.message}`);
        return;
    }
} catch (err) {
    alert(`❌ JavaScript Error: ${err.message}`);
}

    });
});
