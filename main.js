const supabase = window.supabase.createClient(
    "https://ugguhkcxvjunmoebtxow.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVnZ3Voa2N4dmp1bm1vZWJ0eG93Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4NjkwMTQsImV4cCI6MjA1NTQ0NTAxNH0.nvKCwO43yjS6-JQhg7DzUEwEkA14zi7Tw332zMbC_GY"
);

let selectedStudentId = null;

document.getElementById('addStudentBtn').addEventListener('click', () => {
    document.getElementById('addStudentForm').style.display = 'block';
});

async function submitStudent() {
    const name = document.getElementById('studentName').value;
    const location = document.getElementById('studentLocation').value;
    const language = document.getElementById('studentLanguage').value;
    const hours = document.getElementById('studentHours').value;
    const classesLeft = document.getElementById('studentClassesLeft').value;
    const amountPaid = document.getElementById('studentAmountPaid').value;

    if (!name || !location || !language || !hours || !classesLeft || !amountPaid) {
        alert('Please fill in all fields.');
        return;
    }

    await supabase.from('students').insert([{ 
        name, location, language, hours: Number(hours), 
        classes_left: Number(classesLeft), amount_paid: Number(amountPaid) 
    }]);
    document.getElementById('addStudentForm').style.display = 'none';
    fetchStudents();
}

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
                    <div class="toggle ${student.language === "EN" ? "active" : ""}" onclick="toggleLanguage('${student.id}', '${student.language}')">${student.language}</div>
                </div>
            </td>
            <td>${student.hours}</td>
            <td class="classes-left" data-id="${student.id}">${student.classes_left}/4</td>
            <td>${student.amount_paid}</td>
            <td><button onclick="attendClass('${student.id}', ${student.classes_left})" ${student.classes_left === 0 ? "disabled" : ""}>Attend</button></td>
            <td><button onclick="openPaymentForm('${student.id}')">Paid</button></td>
        `;
        tableBody.appendChild(row);
    });
}

async function attendClass(id, classesLeft) {
    if (classesLeft > 0) {
        const newClassesLeft = classesLeft - 1;
        await supabase.from("students").update({ classes_left: newClassesLeft }).eq("id", id);
        fetchStudents();
    }
}

function openPaymentForm(id) {
    selectedStudentId = id;
    document.getElementById("paymentForm").style.display = "block";
}

async function submitPayment() {
    const amount = document.getElementById("amountPaid").value;
    const hours = document.getElementById("classHours").value;
    const newClasses = document.getElementById("newClasses").value;
    if (selectedStudentId) {
        await supabase.from("students").update({
            amount_paid: amount,
            hours: hours,
            classes_left: newClasses,
        }).eq("id", selectedStudentId);
        document.getElementById("paymentForm").style.display = "none";
        fetchStudents();
    }
}

async function toggleLanguage(id, currentLang) {
    const newLang = currentLang === "EN" ? "FR" : "EN";
    await supabase.from("students").update({ language: newLang }).eq("id", id);
    fetchStudents();
}

fetchStudents();
