const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let allIssues = [];


// LOGIN
function login(){

const username = document.getElementById("username")?.value;
const password = document.getElementById("password")?.value;

if(username === "admin" && password === "admin123"){

localStorage.setItem("login","true");
window.location.href = "dashboard.html";

}else{

alert("Invalid Credentials");

}

}



// LOAD ISSUES
async function loadIssues(){

try{

const res = await fetch(API);
const data = await res.json();

allIssues = data.data;

displayIssues(allIssues);
updateStats(allIssues);

}catch(err){

console.log(err);

}

}



// ISSUE COUNT
function updateStats(issues){

const count = document.getElementById("issueCount");

if(count){

count.innerText = `${issues.length} Issues`;

}

}



// DISPLAY CARDS
function displayIssues(issues){

const container = document.getElementById("issuesContainer");

if(!container) return;

container.innerHTML = "";

issues.forEach(issue => {

const isOpen = issue.status === "open";

const borderTop = isOpen ? "border-t-[#10B981]" : "border-t-[#8B5CF6]";

const tag1 = issue.labels?.[0] || "BUG";
const tag2 = issue.labels?.[1] || "HELP WANTED";

const statusIcon = isOpen
? `<img src="assets/Open-Status.png" class="w-6 h-6">`
: `<img src="assets/Closed-Status .png" class="w-6 h-6">`;

const card = document.createElement("div");

card.className = `bg-white rounded-xl border border-slate-100 border-t-4 ${borderTop} shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full`;

card.onclick = () => openModal(issue);

card.innerHTML = `

<div class="p-6 flex-grow">

<div class="flex justify-between items-center mb-4">

${statusIcon}

<span class="px-3 py-1 text-xs font-bold rounded-full bg-slate-100">
${issue.priority}
</span>

</div>

<h3 class="font-bold text-slate-800 text-[16px] mb-3">
${issue.title}
</h3>

<p class="text-slate-400 text-sm mb-6">
${issue.description}
</p>

<div class="flex gap-2">

<span class="px-2.5 py-1 text-[9px] font-black border border-red-100 bg-red-50 text-red-400 rounded-full uppercase">
${tag1}
</span>

<span class="px-2.5 py-1 text-[9px] font-black border border-amber-100 bg-amber-50 text-amber-500 rounded-full uppercase">
${tag2}
</span>

</div>

</div>

<div class="px-6 py-4 border-t border-slate-50 bg-slate-50/20 mt-auto">

<p class="text-[12px] text-slate-500 font-bold">
#${issue.id} by ${issue.author}
</p>

<p class="text-[11px] text-slate-300 font-semibold">
${issue.createdAt.split("T")[0]}
</p>

</div>

`;

container.appendChild(card);

});

}



// TAB FILTER
function changeTab(type,btn){

document.querySelectorAll(".tab").forEach(t => {

t.className = "tab bg-white text-slate-500 border border-slate-200 px-10 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all";

});

btn.className = "tab bg-[#4F46E5] text-white px-10 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all";

const filtered = type === "all"
? allIssues
: allIssues.filter(i => i.status === type);

displayIssues(filtered);
updateStats(filtered);

}



// FIGMA STYLE MODAL
function openModal(issue){

const modal = document.getElementById("modal");
const content = document.getElementById("modalContent");

const statusBg = issue.status === "open"
? "bg-[#10B981]"
: "bg-[#8B5CF6]";

const tag1 = issue.labels?.[0] || "BUG";
const tag2 = issue.labels?.[1] || "HELP WANTED";

modal.classList.remove("hidden");

content.innerHTML = `

<h2 class="text-3xl font-extrabold text-slate-800 mb-3">
${issue.title}
</h2>

<div class="flex items-center gap-3 text-sm font-bold text-slate-400 mb-8">

<span class="${statusBg} text-white px-4 py-1 rounded-full text-[11px] uppercase tracking-wider font-black">
${issue.status}
</span>

<span>•</span>

<span>
Opened by
<span class="text-slate-700 font-extrabold underline decoration-indigo-200 underline-offset-4">
${issue.author}
</span>
</span>

<span>•</span>

<span>${issue.createdAt.split("T")[0]}</span>

</div>

<div class="flex gap-3 mb-8">

<span class="px-3 py-1.5 text-[10px] font-black border border-red-100 bg-red-50 text-red-500 rounded-full uppercase">
${tag1}
</span>

<span class="px-3 py-1.5 text-[10px] font-black border border-amber-100 bg-amber-50 text-amber-500 rounded-full uppercase">
${tag2}
</span>

</div>

<p class="text-slate-500 text-[16px] leading-relaxed mb-10 font-medium">
${issue.description}
</p>

<div class="bg-slate-50 rounded-2xl p-8 flex justify-between items-center border border-slate-100 mb-8">

<div>

<p class="text-slate-400 text-sm font-bold mb-1 uppercase tracking-widest text-[10px]">
Assignee
</p>

<div class="flex items-center gap-3">

<div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-black">
${issue.author.charAt(0).toUpperCase()}
</div>

<p class="text-slate-800 font-black text-xl">
${issue.author}
</p>

</div>

</div>

<div class="text-right">

<p class="text-slate-400 text-sm font-bold mb-2 uppercase tracking-widest text-[10px]">
Priority
</p>

<span class="bg-[#EF4444] text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-100">
${issue.priority}
</span>

</div>

</div>

<div class="flex justify-end">

<button onclick="closeModal()" class="bg-[#4F46E5] hover:bg-indigo-700 text-white px-12 py-4 rounded-[20px] font-black shadow-xl shadow-indigo-200 active:scale-95 transition-all text-sm uppercase tracking-widest">

Close

</button>

</div>

`;

}



function closeModal(){

document.getElementById("modal").classList.add("hidden");

}



// SEARCH
async function searchIssue(){

const q = document.getElementById("searchInput").value;

const res = await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${q}`);

const data = await res.json();

displayIssues(data.data);
updateStats(data.data);

}



// PAGE LOAD
window.onload = () => {

if(document.getElementById("issuesContainer")){

loadIssues();

}

};