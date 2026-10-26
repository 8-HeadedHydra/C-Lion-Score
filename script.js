// 1. Connect to Supabase using your project's unique internet addresses
// CHANGE line 2 to look exactly like this:
const SUPABASE_URL = "https://kzxxmkltlcswazyfpghc.supabase.co"; 

// THIS IS THE VARIABLE LINE THAT WAS ACCIDENTALLY DELETED:
// Paste your full new token directly here between the quotes:
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6eHhta2x0bGNzd2F6eWZwZ2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NjkwODQsImV4cCI6MjEwODU0NTA4NH0.sMvfzMGHV6Cycq7AdkiIFbZ2NHC0KYyBtzlNQksBhCg";
//sheesh talk about long keys
// This creates the database link
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Select HTML Elements
let RadlionScore = document.getElementById("RadLionScore");
let ElectroLionScore = document.getElementById("ElectroLionScore");
let MechaLionScore = document.getElementById("MechaLionScore");

let ButtonRad = document.getElementById("RadLion");
let ButtonElec = document.getElementById("ElectroLion");
let ButtonMecha = document.getElementById("MechaLion");
let ResetBtn = document.getElementById("ResetBtn");

// Define score variables
let RadLions = 0;
let ElectroLions = 0;
let MechaLions = 0;

// Set your admin modifier password here
const ADMIN_PASSWORD = "ocpslions2026"; 

// 3. Download fresh scores from the network database
async function fetchScores() {
    const { data, error } = await db.from('scoreboard').select('*').eq('id', 1).single();
    if (data) {
        RadLions = data.rad_lions;
        ElectroLions = data.electro_lions;
        MechaLions = data.mecha_lions;
        updateDisplay();
    }
}

// Render values out to the browser UI layout
function updateDisplay() {
    RadlionScore.innerText = "RadLions: " + RadLions;
    ElectroLionScore.innerText = "ElectroLions: " + ElectroLions;
    MechaLionScore.innerText = "MechaLions: " + MechaLions;
}

// 4. Send updated math values back to your cloud data sheet
async function saveScores() {
    await db.from('scoreboard').update({ 
        rad_lions: RadLions, 
        electro_lions: ElectroLions, 
        mecha_lions: MechaLions 
    }).eq('id', 1);
    updateDisplay();
}

// Security Check Prompt Interceptor
function verifyAndExecute(actionCallback) {
    let passwordCheck = prompt("Enter the password to alter scores:");
    if (passwordCheck === ADMIN_PASSWORD) {
        actionCallback();
    } else {
        alert("Incorrect password! Score unchanged.");
    }
}

// 5. Click Event Actions (Intercept with prompt, then push to cloud)
ButtonRad.addEventListener("click", () => {
    verifyAndExecute(() => { RadLions += 1; saveScores(); });
});

ButtonElec.addEventListener("click", () => {
    verifyAndExecute(() => { ElectroLions += 1; saveScores(); });
});

ButtonMecha.addEventListener("click", () => {
    verifyAndExecute(() => { MechaLions += 1; saveScores(); });
});

ResetBtn.addEventListener("click", () => {
    verifyAndExecute(() => { RadLions = 0; ElectroLions = 0; MechaLions = 0; saveScores(); });
});

// Run immediately when page loads to fetch active numbers
fetchScores();

// Automatically sweep and update the local display every 3 seconds
setInterval(fetchScores, 3000);
