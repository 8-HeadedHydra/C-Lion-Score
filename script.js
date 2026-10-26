// 1. Connect to Supabase using your project's unique internet addresses
const SUPABASE_URL = "https://supabase.co"; 
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt6eHhta2x0bGNzd2F6eWZwZ2hjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5NjkwODQsImV4cCI6MjEwODU0NTA4NH0.sMvfzMGHV6Cycq7AdkiIFbZ2NHC0KYyBtzlNQksBhCg"; 

const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Select HTML Elements
let RadlionScore = document.getElementById("RadLionScore");
let ElectroLionScore = document.getElementById("ElectroLionScore");
let MechaLionScore = document.getElementById("MechaLionScore");

let ButtonRad = document.getElementById("RadLion");
let ButtonElec = document.getElementById("ElectroLion");
let ButtonMecha = document.getElementById("MechaLion");

let ButtonRadMinus = document.getElementById("RadLionMinus");
let ButtonElecMinus = document.getElementById("ElectroLionMinus");
let ButtonMechaMinus = document.getElementById("MechaLionMinus");

let ResetBtn = document.getElementById("ResetBtn");

let RadLions = 0, ElectroLions = 0, MechaLions = 0;
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

function updateDisplay() {
    RadlionScore.innerText = "RadLions: " + RadLions;
    ElectroLionScore.innerText = "ElectroLions: " + ElectroLions;
    MechaLionScore.innerText = "MechaLions: " + MechaLions;
}

// 4. Send updated values back to the cloud
async function saveScores() {
    await db.from('scoreboard').update({ 
        rad_lions: RadLions, 
        electro_lions: ElectroLions, 
        mecha_lions: MechaLions 
    }).eq('id', 1);
    updateDisplay();
}

// Security Check Prompt
function verifyAndExecute(actionCallback) {
    let passwordCheck = prompt("Enter the password to alter scores:");
    if (passwordCheck === ADMIN_PASSWORD) {
        actionCallback();
    } else {
        alert("Incorrect password! Score unchanged.");
    }
}

// 5. Click Event Actions
ButtonRad.addEventListener("click", () => { verifyAndExecute(() => { RadLions += 1; saveScores(); }); });
ButtonElec.addEventListener("click", () => { verifyAndExecute(() => { ElectroLions += 1; saveScores(); }); });
ButtonMecha.addEventListener("click", () => { verifyAndExecute(() => { MechaLions += 1; saveScores(); }); });

ButtonRadMinus.addEventListener("click", () => { verifyAndExecute(() => { RadLions -= 1; saveScores(); }); });
ButtonElecMinus.addEventListener("click", () => { verifyAndExecute(() => { ElectroLions -= 1; saveScores(); }); });
ButtonMechaMinus.addEventListener("click", () => { verifyAndExecute(() => { MechaLions -= 1; saveScores(); }); });

ResetBtn.addEventListener("click", () => { verifyAndExecute(() => { RadLions = 0; ElectroLions = 0; MechaLions = 0; saveScores(); }); });

// Run network operations
fetchScores();
setInterval(fetchScores, 3000);
