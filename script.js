// 1. Connect to Supabase using your project's unique internet addresses
const SUPABASE_URL = "https://supabase.co"; 
const SUPABASE_KEY = "sb_publishable_44pCo5c2Gs2c2acyTRSWDA_a9Kty6vT_f7U-027_24"; 

// Connected under 'db' to prevent naming conflicts with the global library
const db = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Select HTML Elements
let RadlionScore = document.getElementById("RadLionScore");
let ElectroLionScore = document.getElementById("ElectroLionScore");
let MechaLionScore = document.getElementById("MechaLionScore");

let ButtonRad = document.getElementById("RadLion");
let ButtonElec = document.getElementById("ElectroLion");
let ButtonMecha = document.getElementById("MechaLion");

// New Minus Buttons
let ButtonRadMinus = document.getElementById("RadLionMinus");
let ButtonElecMinus = document.getElementById("ElectroLionMinus");
let ButtonMechaMinus = document.getElementById("MechaLionMinus");

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
// Plus Buttons
ButtonRad.addEventListener("click", () => {
    verifyAndExecute(() => { RadLions += 1; saveScores(); });
});

ButtonElec.addEventListener("click", () => {
    verifyAndExecute(() => { ElectroLions += 1; saveScores(); });
});

ButtonMecha.addEventListener("click", () => {
    verifyAndExecute(() => { MechaLions += 1; saveScores(); });
});

// Minus Buttons (NEW)
ButtonRadMinus.addEventListener("click", () => {
    verifyAndExecute(() => { RadLions -= 1; saveScores(); });
});

ButtonElecMinus.addEventListener("click", () => {
    verifyAndExecute(() => { ElectroLions -= 1; saveScores(); });
});

ButtonMechaMinus.addEventListener("click", () => {
    verifyAndExecute(() => { MechaLions -= 1; saveScores(); });
});

// Reset Button
ResetBtn.addEventListener("click", () => {
    verifyAndExecute(() => { RadLions = 0; ElectroLions = 0; MechaLions = 0; saveScores(); });
});

// Run immediately when page loads to fetch active numbers
fetchScores();

// Automatically sweep and update the local display every 3 seconds
setInterval(fetchScores, 3000);
