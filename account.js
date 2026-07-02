const saveBtn =
document.getElementById("saveBtn");

const passwordBtn =
document.getElementById("passwordBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const deleteBtn =
document.getElementById("deleteBtn");

window.onload=()=>{

const user=
JSON.parse(localStorage.getItem("clarityUser"));

if(user){

email.value=user.email;
username.value=user.username;

}

};

saveBtn.onclick=()=>{

const user={

email:email.value,
username:username.value

};

localStorage.setItem(
"clarityUser",
JSON.stringify(user)
);

alert("Account updated.");

};

passwordBtn.onclick=()=>{

const newPass=
newPassword.value;

const confirm=
confirmPassword.value;

if(newPass!==confirm){

alert("Passwords do not match.");

return;

}

let user=
JSON.parse(localStorage.getItem("clarityUser"));

if(user){

user.password=newPass;

localStorage.setItem(
"clarityUser",
JSON.stringify(user)
);

}

alert("Password updated.");

};

logoutBtn.onclick=()=>{

localStorage.removeItem("loggedIn");

window.location.href="index.html";

};

deleteBtn.onclick=()=>{

if(confirm("Delete your account?")){

localStorage.clear();

window.location.href="register.html";

}

};