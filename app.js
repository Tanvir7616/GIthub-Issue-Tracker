const API = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

let allIssues = [];

// LOGIN

function login(){

const username=document.getElementById("username")?.value
const password=document.getElementById("password")?.value

if(username==="admin" && password==="admin123"){

localStorage.setItem("login","true")
window.location.href="dashboard.html"

}else{

alert("Invalid Credentials")

}

}



// LOAD ISSUES

async function loadIssues(){

try{

const res=await fetch(API)
const data=await res.json()

allIssues=data.data

displayIssues(allIssues)
updateStats(allIssues)

}catch(e){

console.log(e)

}

}



// UPDATE ISSUE COUNT

function updateStats(issues){

const count=document.getElementById("issueCount")

if(count){

count.innerText=`${issues.length} Issues`

}

}



// DISPLAY ISSUES

function displayIssues(issues){

const container=document.getElementById("issuesContainer")

if(!container) return

container.innerHTML=""

issues.forEach(issue=>{

const isOpen=issue.status==="open"

const borderTop=isOpen ? "border-t-[#10B981]" : "border-t-[#8B5CF6]"

const tag1=issue.labels?.[0] || "BUG"
const tag2=issue.labels?.[1] || "HELP WANTED"

const statusIcon=isOpen
? `<div class="w-6 h-6 border-2 border-dashed border-[#10B981] rounded-full flex items-center justify-center"><div class="w-2 h-2 bg-[#10B981] rounded-full"></div></div>`
: `<div class="w-6 h-6 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white">✓</div>`

const card=document.createElement("div")

card.className=`bg-white rounded-xl border border-slate-100 border-t-4 ${borderTop} shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col h-full`

card.onclick=()=>openModal(issue)

card.innerHTML=`

<div class="p-6 flex-grow">

<div class="flex justify-between items-center mb-4">

${statusIcon}

<span class="px-3 py-1 text-xs font-bold rounded-full bg-slate-100">${issue.priority}</span>

</div>

<h3 class="font-bold text-slate-800 mb-2">${issue.title}</h3>

<p class="text-slate-400 text-sm mb-4">${issue.description}</p>

<div class="flex gap-2">

<span class="px-2 py-1 text-xs bg-red-50 text-red-500 rounded-full">${tag1}</span>

<span class="px-2 py-1 text-xs bg-amber-50 text-amber-500 rounded-full">${tag2}</span>

</div>

</div>

<div class="p-4 border-t text-sm text-slate-500">

#${issue.id} by ${issue.author}

<br>

${issue.createdAt.split("T")[0]}

</div>

`

container.appendChild(card)

})

}



// TAB FILTER

function changeTab(type,btn){

document.querySelectorAll(".tab").forEach(t=>{
t.className="tab bg-white text-slate-500 border border-slate-200 px-10 py-2.5 rounded-xl font-bold hover:bg-slate-50 transition-all"
})

btn.className="tab bg-[#4F46E5] text-white px-10 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-100 transition-all"

const filtered=type==="all"
? allIssues
: allIssues.filter(i=>i.status===type)

displayIssues(filtered)
updateStats(filtered)

}



// MODAL

function openModal(issue){

const modal=document.getElementById("modal")
const content=document.getElementById("modalContent")

modal.classList.remove("hidden")

content.innerHTML=`

<h2 class="text-2xl font-bold mb-4">${issue.title}</h2>

<p class="mb-6">${issue.description}</p>

<p><b>Status:</b> ${issue.status}</p>
<p><b>Author:</b> ${issue.author}</p>
<p><b>Priority:</b> ${issue.priority}</p>
<p><b>Created:</b> ${issue.createdAt.split("T")[0]}</p>

<div class="text-right mt-6">

<button onclick="closeModal()" class="bg-indigo-600 text-white px-6 py-2 rounded-lg">

Close

</button>

</div>

`

}



function closeModal(){

document.getElementById("modal").classList.add("hidden")

}



// SEARCH

async function searchIssue(){

const q=document.getElementById("searchInput").value

const res=await fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${q}`)

const data=await res.json()

displayIssues(data.data)

updateStats(data.data)

}



// PAGE LOAD

window.onload=()=>{

if(document.getElementById("issuesContainer")){

loadIssues()

}

}