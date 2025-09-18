
/* ====== CONFIG: put your real API endpoints here ====== */
const ASSIGNMENTS_URL = "https://atx27fg9t0.execute-api.us-east-1.amazonaws.com/prod/ViewAssignments"; // works already
const GRADES_URL      = "https://dir9m36p05.execute-api.us-east-1.amazonaws.com/prod/grades"; // /grades route you created
const UPLOAD_URL      = "https://z0li0smb36.execute-api.us-east-1.amazonaws.com/prod/UploadAssignments"; // optional: presigned upload or lambda endpoint

/* ====== THEME PICKER ====== */
const THEME_KEY = "edutrack.theme";
const themePicker = () => document.getElementById("themePicker");
function applyTheme(v){
  document.documentElement.setAttribute("data-theme", v);
  localStorage.setItem(THEME_KEY, v);
}
function initTheme(){
  const saved = localStorage.getItem(THEME_KEY) || "system";
  themePicker().value = saved;
  applyTheme(saved);
  themePicker().addEventListener("change", e=>applyTheme(e.target.value));
}

/* ====== DOM HELPERS ====== */
const $ = (s)=>document.querySelector(s);
const setText = (id, t)=>{ const el = document.getElementById(id); if (el) el.textContent = t; };
function toast(msg){
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"), 2800);
}
function prettyError(e){
  if (!e) return "Unknown error";
  if (typeof e === "string") return e;
  return e.message || JSON.stringify(e);
}

/* ====== GRADES ====== */
let chart;
async function fetchGrades(){
  const status = $("#status");
  try{
    status.textContent = "Loading grades…";
    const res = await fetch(GRADES_URL, {mode: "cors"});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const pairs = Object.entries(data).filter(([k])=>k!=="name");
    // table
    const body = $("#gradesBody"); body.innerHTML = "";
    for (const [subject, score] of pairs){
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${subject}</td><td>${score}</td>`;
      body.appendChild(tr);
    }
    // chart
    const labels = pairs.map(([k])=>k);
    const values = pairs.map(([_,v])=>v);
    chart?.destroy();
    chart = new Chart($("#gradesChart"), {
      type: "bar",
      data: { labels, datasets: [{ label: "Grade (%)", data: values }] },
      options: { responsive: true, scales: { y: { beginAtZero:true, max: 100 } } }
    });
    status.textContent = "";
  }catch(err){
    status.textContent = `Failed to load grades.\n${GRADES_URL} → ${prettyError(err)}\nNetwork/CORS blockage. Enable CORS on the API and deploy to prod.`;
  }
}

/* ====== ASSIGNMENTS ====== */
async function fetchAssignments(){
  const status = $("#status");
  try{
    status.textContent = "Loading assignments…";
    const res = await fetch(ASSIGNMENTS_URL, {mode:"cors"});
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const ul = $("#assignmentList"); ul.innerHTML="";
    data.forEach(a=>{
      const li=document.createElement("li");
      li.textContent = `${a.title} — Due: ${a.dueDate} [${a.status}]`;
      ul.appendChild(li);
    });
    status.textContent = "";
  }catch(err){
    status.textContent = `Failed to load assignments.\n${ASSIGNMENTS_URL} → ${prettyError(err)}\nCheck API Gateway CORS and redeploy to prod.`;
  }
}

/* ====== UPLOAD ====== */
$("#uploadForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const course = $("#course").value.trim();
  const file = $("#file").files[0];
  if (!UPLOAD_URL){ toast("Upload URL not set. Configure UPLOAD_URL in script.js."); return; }
  if (!file){ toast("Pick a file to upload."); return; }
  setText("uploadStatus", "Uploading…");
  try{
    const fd = new FormData(); fd.append("course", course); fd.append("file", file);
    const res = await fetch(UPLOAD_URL, { method: "POST", body: fd });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    setText("uploadStatus", "✅ Successfully submitted!");
    toast("Assignment uploaded successfully ✅");
    $("#uploadForm").reset();
  }catch(err){
    setText("uploadStatus", "❌ Upload failed: " + prettyError(err));
    toast("Upload failed");
  }
});

/* ====== INIT ====== */
window.addEventListener("DOMContentLoaded", ()=>{
  initTheme();
  $("#btnFetchGrades").addEventListener("click", fetchGrades);
  $("#btnFetchAssignments").addEventListener("click", fetchAssignments);
  $("#btnSubmitGrades").addEventListener("click", ()=>toast("Example action: submit grades"));
  $("#btnUpload").addEventListener("click", ()=>$("#file").click());
});
