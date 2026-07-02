const status =
document.getElementById("deviceStatus");

const wifi =
document.getElementById("wifi");

const battery =
document.getElementById("battery");

let connected = true;

function updateUI(){

if(connected){

status.innerHTML="● Connected";
status.className="online";

wifi.innerHTML="Connected";

}else{

status.innerHTML="● Disconnected";
status.className="offline";

wifi.innerHTML="Offline";

}

}

updateUI();

document
.getElementById("connectBtn")
.onclick=()=>{

connected=true;

updateUI();

alert("Connected!");

};

document
.getElementById("disconnectBtn")
.onclick=()=>{

connected=false;

updateUI();

alert("Disconnected!");

};

document
.getElementById("refreshBtn")
.onclick=()=>{

battery.innerHTML=
Math.floor(Math.random()*10+90)+"%";

document.getElementById("ip").innerHTML=
"192.168.1."+Math.floor(Math.random()*200);

alert("Device refreshed.");

};

