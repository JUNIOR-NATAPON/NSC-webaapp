const toggle = document.getElementById("darkToggle");

toggle.checked =
localStorage.getItem("theme") === "dark";

applyTheme();

toggle.addEventListener("change",()=>{

if(toggle.checked){

localStorage.setItem("theme","dark");

}else{

localStorage.setItem("theme","light");

}

applyTheme();

});

function applyTheme(){

if(localStorage.getItem("theme")==="dark"){

document.body.classList.add("dark");

}else{

document.body.classList.remove("dark");

}

}

document.getElementById("logoutBtn").onclick=()=>{

localStorage.removeItem("loggedIn");

window.location.href="index.html";

};