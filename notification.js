const notifications=[

{
icon:"fa-triangle-exclamation",
color:"red",
title:"High Turbidity",
text:"Water turbidity reached 7.5 NTU.",
time:"2 mins ago"
},

{
icon:"fa-filter",
color:"orange",
title:"Replace Filter Soon",
text:"Filter health is below 20%.",
time:"1 hour ago"
},

{
icon:"fa-circle-check",
color:"green",
title:"Device Connected",
text:"ESP32 connected successfully.",
time:"Today"
}

];

const list=document.getElementById("notificationList");

notifications.forEach(item=>{

list.innerHTML+=`

<div class="notice">

<i class="fa-solid ${item.icon} ${item.color}"></i>

<div>

<h4>${item.title}</h4>

<p>${item.text}</p>

<small>${item.time}</small>

</div>

</div>

`;

});

document.querySelectorAll("input").forEach(toggle=>{

toggle.addEventListener("change",()=>{

localStorage.setItem(
toggle.id,
toggle.checked
);

});

});