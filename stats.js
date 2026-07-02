const labels = [
"08:00",
"09:00",
"10:00",
"11:00",
"12:00",
"13:00",
"14:00",
"15:00"
];

const values = [
2.4,
2.7,
2.3,
3.1,
2.8,
2.5,
2.9,
2.4
];

const avg =
values.reduce((a,b)=>a+b,0)/values.length;

document.getElementById("avg").innerHTML =
avg.toFixed(1);

document.getElementById("max").innerHTML =
Math.max(...values).toFixed(1);

document.getElementById("min").innerHTML =
Math.min(...values).toFixed(1);

const ctx =
document.getElementById("ntuChart");

new Chart(ctx,{

type:"line",

data:{

labels:labels,

datasets:[{

label:"NTU",

data:values,

borderColor:"#3568ff",

backgroundColor:"rgba(53,104,255,.15)",

fill:true,

tension:.4,

pointRadius:5,

pointBackgroundColor:"#3568ff"

}]

},

options:{

responsive:true,

plugins:{

legend:{
display:false
}

},

scales:{

y:{

beginAtZero:true,

max:10

}

}

}

});

const table =
document.getElementById("historyTable");

for(let i=0;i<labels.length;i++){

let status="Good";
let cls="good";

if(values[i]>5){

status="Poor";
cls="bad";

}
else if(values[i]>3){

status="Moderate";
cls="warning";

}

table.innerHTML += `
<tr>
<td>${labels[i]}</td>
<td>${values[i].toFixed(1)}</td>
<td class="${cls}">${status}</td>
</tr>
`;

}