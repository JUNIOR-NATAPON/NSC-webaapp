let health = 87;

const progress =
document.getElementById("progressBar");

const percent =
document.getElementById("percent");

const days =
document.getElementById("daysLeft");

const liters =
document.getElementById("liters");

function updateFilter(){

progress.style.width = health + "%";

percent.innerHTML = health + "%";

days.innerHTML =
Math.round((health/100)*42);

liters.innerHTML =
(500-health).toFixed(0)+" L";

if(health>70){

progress.style.background =
"linear-gradient(90deg,#22c55e,#4ade80)";

}
else if(health>40){

progress.style.background =
"linear-gradient(90deg,#f59e0b,#fbbf24)";

}
else{

progress.style.background =
"linear-gradient(90deg,#ef4444,#f87171)";

}

}

updateFilter();

document
.getElementById("replaceBtn")
.onclick=()=>{

if(confirm("Replace filter?")){

health=100;

updateFilter();

alert("Filter replaced successfully!");

}

};

setInterval(()=>{

health--;

if(health<15){

health=15;

}

updateFilter();

},10000);