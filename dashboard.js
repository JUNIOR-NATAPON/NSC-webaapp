const ntuElement = document.getElementById("ntuValue");

let currentNTU = 2.4;

function updateStatus(value){

    ntuElement.innerHTML = value.toFixed(1);

    const badge = document.querySelector(".badge");

    if(value <= 5){

        badge.innerHTML = "Clean Water";
        badge.style.background = "#ffffff";
        badge.style.color = "#3568ff";

    }else if(value <= 10){

        badge.innerHTML = "Moderate";
        badge.style.background = "#FFD54F";
        badge.style.color = "#333";

    }else{

        badge.innerHTML = "Poor";
        badge.style.background = "#FF5252";
        badge.style.color = "#fff";

    }

}

setInterval(()=>{

    currentNTU += (Math.random()-0.5);

    if(currentNTU<1)
        currentNTU=1;

    if(currentNTU>12)
        currentNTU=12;

    updateStatus(currentNTU);

},5000);

document.querySelectorAll(".card")[0].onclick=()=>{
    window.location.href="filter.html";
};

document.querySelectorAll(".card")[1].onclick=()=>{
    window.location.href="stats.html";
};

document.querySelectorAll(".card")[2].onclick=()=>{
    window.location.href="turbidity.html";
};

document.querySelectorAll(".card")[3].onclick=()=>{
    window.location.href="turbidity.html";
};