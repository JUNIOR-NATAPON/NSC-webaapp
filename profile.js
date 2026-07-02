const form =
document.getElementById("profileForm");

window.onload=()=>{

const profile=
JSON.parse(localStorage.getItem("profile"));

if(profile){

name.value=profile.name;
email.value=profile.email;
phone.value=profile.phone;
address.value=profile.address;

}

}

form.addEventListener("submit",(e)=>{

e.preventDefault();

const profile={

name:name.value,
email:email.value,
phone:phone.value,
address:address.value

};

localStorage.setItem(
"profile",
JSON.stringify(profile)
);

alert("Profile Updated!");

});