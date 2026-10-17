const offers = [
 {id:"game", category:"games", icon:"🎮", title:"Przetestuj grę", description:"Przejdź poziom w przykładowej grze demonstracyjnej.", reward:120, tag:"Gra"},
 {id:"survey", category:"surveys", icon:"📝", title:"Krótka ankieta", description:"Zobacz, jak będzie wyglądał przepływ ankiety.", reward:70, tag:"Ankieta"},
 {id:"app", category:"apps", icon:"📱", title:"Poznaj aplikację", description:"Przykładowe zadanie instalacji — bez prawdziwego pobierania.", reward:90, tag:"Aplikacja"},
 {id:"quiz", category:"surveys", icon:"💡", title:"Quiz wiedzy", description:"Odpowiedz na kilka przykładowych pytań.", reward:45, tag:"Quiz"},
 {id:"puzzle", category:"games", icon:"🧩", title:"Rozwiąż łamigłówkę", description:"Zadanie testowe do demonstracji naliczania punktów.", reward:55, tag:"Gra"},
 {id:"mobile", category:"apps", icon:"🚀", title:"Odkryj nową apkę", description:"Przykładowa karta oferty w panelu EarnZone.", reward:100, tag:"Aplikacja"}
];
const key = "earnzone-demo-completed-v1";
let completed = new Set(JSON.parse(localStorage.getItem(key) || "[]"));
const grid = document.querySelector("#offerGrid");
const balance = document.querySelector("#balance");
const dialog = document.querySelector("#demoDialog");
function render(filter="all"){
  grid.innerHTML="";
  offers.filter(o=>filter==="all"||o.category===filter).forEach(o=>{
    const done=completed.has(o.id);
    const card=document.createElement("article"); card.className="offer";
    card.innerHTML=`<div class="offer-top"><span class="offer-icon">${o.icon}</span><span class="reward">+${o.reward} EZ</span></div><h3>${o.title}</h3><p>${o.description}</p><button class="btn ${done?"done":""}" ${done?"disabled":""}>${done?"Ukończono ✓":"Przetestuj zadanie"}</button>`;
    card.querySelector("button").addEventListener("click",()=>{if(completed.has(o.id))return;completed.add(o.id);localStorage.setItem(key,JSON.stringify([...completed]));updateBalance();render(filter);});
    grid.appendChild(card);
  });
}
function updateBalance(){balance.textContent=offers.filter(o=>completed.has(o.id)).reduce((n,o)=>n+o.reward,0).toLocaleString("pl-PL");}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));render(b.dataset.filter);}));
document.querySelector("#loginBtn").addEventListener("click",()=>dialog.showModal());
document.querySelector("#closeDialog").addEventListener("click",()=>dialog.close());
document.querySelector("#okDialog").addEventListener("click",()=>dialog.close());
document.querySelector("#resetBtn").addEventListener("click",()=>{completed.clear();localStorage.removeItem(key);updateBalance();render();});
document.querySelector("#year").textContent=new Date().getFullYear();
updateBalance();render();
