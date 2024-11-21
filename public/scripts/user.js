import { fetchData } from "./main.js"

let regForm = document.getElementById("registerForm")

if(regForm) regForm.addEventListener('submit', register)

  function register(e) {
    e.preventDefault();

    let firstname = document.getElementById("firstname").value;
    let lastname = document.getElementById("lastname").value;
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let cPassword = document.getElementById("confpassword").value;
  
    const errorElement = document.querySelector(".error");
    errorElement.innerText = ""; 
  
    
    if (password !== cPassword) {
      console.log("Passwords do not match");
      errorElement.innerText = "Passwords Must Match!";
      document.getElementById("password").value = "";
      document.getElementById("confpassword").value = "";
      return; 
    } 
  
    const user = {
      firstName: firstname,
      lastName: lastname,
      userName: username,
      Email: email,
      password: password
    };
  console.log(user);
    fetchData('/users/register', user, 'POST')
      .then(data => {
        if (!data.message) {
          setCurrentUser(data);
          window.location.href = "index.html";
        }
      })
      .catch(err => {
        errorElement.innerHTML = `${err.message}`;
      });
  
    document.getElementById("welcome").innerText = `Welcome ${username}!`;
  }

let logForm = document.getElementById("loginForm")
if(logForm) logForm.addEventListener('submit', login)

function login(e) {
  e.preventDefault()

  let username = document.getElementById("username").value
  let password = document.getElementById("password").value
  const errorElement = document.querySelector(".error");
  errorElement.innerText = ""; 
  const user = {
    userName: username,
    password: password
  }
  // make a call to the server
  fetchData('/users/login', user, 'POST')
    .then(data => {
      if (!data.message) {
        setCurrentUser(data)
        window.location.href = "index.html"
      }
    })
    .catch(err => {
      errorElement.innerHTML = `${err.message}`;
    })                     

  document.getElementById("welcome").innerText = `Welcome ${username}!`
}


function setCurrentUser(user) {
  localStorage.setItem('user', JSON.stringify(user))
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('user'))
}

function removeUser() {
  localStorage.removeItem('user')
  window.location.href = 'index.html'
}

export {getCurrentUser, setCurrentUser, removeUser}