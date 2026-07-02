const circle = document.getElementById("progressCircle");

const ntu = document.getElementById("ntuValue");

const before = document.getElementById("beforeNTU");

const after = document.getElementById("afterNTU");

const efficiency = document.getElementById("efficiency");

const statusText = document.getElementById("statusText");

const circumference = 565;

function updateGauge(value){

let percent = Math.max(0,Math.min(100,(10-value)/10*100));

let offset = circumference-(percent/100)*circumference;

circle.style.strokeDashoffset = offset;

ntu.innerHTML = value.toFixed(1);

after.innerHTML = value.toFixed(1)+" NTU";

let beforeValue = value+Math.random()*6+2;

before.innerHTML = beforeValue.toFixed(1)+" NTU";

let eff = ((beforeValue-value)/beforeValue)*100;

efficiency.innerHTML = eff.toFixed(0)+"%";

if(value<=5){

statusText.innerHTML="Clean Water";
statusText.style.background="#dff7e8";
statusText.style.color="#1b8f42";
circle.style.stroke="#22c55e";

}
else if(value<=10){

statusText.innerHTML="Moderate";
statusText.style.background="#fff4d6";
statusText.style.color="#d97706";
circle.style.stroke="#f59e0b";

}
else{

statusText.innerHTML="Poor";
statusText.style.background="#ffe2e2";
statusText.style.color="#dc2626";
circle.style.stroke="#ef4444";

}

}

let current=2.4;

updateGauge(current);

setInterval(()=>{

current+=(Math.random()-0.5);

if(current<1)
current=1;

if(current>15)
current=15;

updateGauge(current);

},3000);