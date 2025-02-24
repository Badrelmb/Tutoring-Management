const supabase = window.supabase.createClient(
    "https://ugguhkcxvjunmoebtxow.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZ3Voa2N4dmp1bm1vZWJ0eG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NjkwMTQsImV4cCI6MjA1NTQ0NTAxNH0.nvKCwO43yjS6-JQhg7DzUEwEkA14zi7Tw332zMbC_GY"
);

let selectedStudentId = null;

// Ensure the DOM is loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addStudentBtn").addEventListener("click", () => {
        document.getElementById("addStudentForm").style.display = "block";
    });

    fetchStudents();
});

// Function to add a student
async function submitStudent() {
    const name = document.getElementById("studentName").value.trim();
    const location = document.getElementById("studentLocation").value.trim();
    const language = document.getElementById("studentLanguage").value;
    const hours = parseInt(document.getElementById("studentHours").value);
    const classesLeft = parseInt(document.getElementById("studentClassesLeft").value);
    const amountPaid = parseFloat(document.getElementById("studentAmountPaid").value);

    if (!name || !location || !language || isNaN(hours) || isNaN(classesLeft) || isNaN(amountPaid)) {
        alert("Please fill in all fields correctly.");
        return;
    }

    await supabase.from("students").insert([{ 
        name, location, language, hours, 
        classes_left: classesLeft, amount_paid: amountPaid
    }]);
    
    document.getElementById("addStudentForm").style.display = "none";
    fetchStudents();
}

// Fetch students from Supabase
async function fetchStudents() {
    const { data, error } = await supabase.from("students").select("*");
    if (error) {
        console.error(error);
        return;
    }

    const tableBody = document.querySelector("#studentsTable tbody");
    tableBody.innerHTML = "";

    data.forEach((student) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.location}</td>
            <td>
                <div class="toggle-container">
                    <div class="toggle ${student.language === "EN" ? "active" : ""}" 
                         onclick="toggleLanguage('${student.id}', '${student.language}')">${student.language}</div>
                </div>
            </td>
            <td>${student.hours}</td>
            <td class="classes-left" data-id="${student.id}">${student.classes_left}/4</td>
            <td>${student.amount_paid}</td>
            <td><button onclick="attendClass('${student.id}')" ${student.classes_left === 0 ? "disabled" : ""}>Attend</button></td>
            <td><button onclick="openPaymentForm('${student.id}')">Paid</button></td>
        `;
        tableBody.appendChild(row);
    });
}

// Attend class function
async function attendClass(id) {
    let { data, error } = await supabase.from("students").select("classes_left").eq("id", id).single();
    if (error || !data) return;

    let newClassesLeft = data.classes_left - 1;
    if (newClassesLeft < 0) return;

    await supabase.from("students").update({ classes_left: newClassesLeft }).eq("id", id);
    fetchStudents();
}

// Open payment form
function openPaymentForm(id) {
    selectedStudentId = id;
    document.getElementById("paymentForm").style.display = "block";
}

// Submit payment update
async function submitPayment() {
    const amount = parseFloat(document.getElementById("amountPaid").value);
    const hours = parseInt(document.getElementById("classHours").value);
    const newClasses = parseInt(document.getElementById("newClasses").value);

    if (!selectedStudentId || isNaN(amount) || isNaN(hours) || isNaN(newClasses)) {
        alert("Invalid input.");
        return;
    }

    await supabase.from("students").update({
        amount_paid: amount,
        hours: hours,
        classes_left: newClasses
    }).eq("id", selectedStudentId);

    document.getElementById("paymentForm").style.display = "none";
    fetchStudents();
}

// Toggle language
async function toggleLanguage(id, currentLang) {
    const newLang = currentLang === "EN" ? "FR" : "EN";
    await supabase.from("students").update({ language: newLang }).eq("id", id);
    fetchStudents();
}
