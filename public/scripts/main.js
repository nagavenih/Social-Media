import { getCurrentUser, removeUser } from "./user.js";

let nav = document.querySelector("nav");
const currentUser = getCurrentUser();
let username = currentUser ? `${currentUser.lastName}, ${currentUser.firstName}` : "";

if (currentUser) {
  nav.innerHTML = `
    <ul class="navbar">
      <li><a href="index.html" class="${isActive('index.html')}">Home</a></li>
      <li><a href="post.html" class="${isActive('post.html')}">Post</a></li>
      <li><a href="reset.html" class="${isActive('reset.html')}">Reset</a></li>
      <li><a href="userprofile.html" class="${isActive('userprofile.html')}">Profile</a></li>
      <li><a href="#" id="delete-profile">Delete Profile</a></li>
      <li><a href="#" id="logout">Logout</a></li>
    </ul>
    <div class="username-container">
      <span class="username">${username}</span>
    </div>
  `;

  document.getElementById("delete-profile").addEventListener("click", async (event) => {
    event.preventDefault();
    await handleDeleteProfile();
  });

  document.getElementById("logout").addEventListener("click", async (event) => {
    event.preventDefault();
    await handleLogout();
  });

  document.querySelector('a[href="userprofile.html"]').addEventListener("click", loadUserProfile);
} else {
  nav.innerHTML = `
    <ul class="navbar">
      <li><a href="index.html" class="${isActive('index.html')}">Home</a></li>
      <li><a href="register.html" class="${isActive('register.html')}">Register</a></li>

      <li><a href="login.html" class="${isActive('login.html')}">Login</a></li>
      <li><a href="reset.html" class="${isActive('reset.html')}">Reset</a></li>
    </ul>
  `;
}

function isActive(page) {
  return window.location.pathname.endsWith(page) ? "active" : "";
}

async function handleLogout() {
  window.alert("Thank You, See you Again!!!!");
  try {
    removeUser();
    await fetchData("/logout", {}, "POST");
    window.location.href = "login.html";
  } catch (error) {
    console.error("Logout error:", error);
  }
}

async function handleDeleteProfile() {
  const confirmation = window.confirm("Are you sure you want to delete your profile? This action cannot be undone.");

  if (confirmation) {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const user = { UserID: userData.UserID, userName: userData.userName };
      await fetchData("/users/remove", user, "DELETE");
      removeUser();
      alert("Your profile has been deleted successfully.");
      window.location.href = "index.html";
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("There was an error deleting your profile. Please try again.");
    }
  }
}

function loadUserProfile() {
  const users = JSON.parse(localStorage.getItem("user"));
  const currentUser = users.find((user) => user.userName === getCurrentUser().userName);

  if (currentUser) {
    alert(`User Profile:\nName: ${currentUser.firstName} ${currentUser.lastName}\nEmail: ${currentUser.Email}\nUsername: ${currentUser.userName}`);
  } else {
    alert("User profile not found.");
  }
}

export async function fetchData(route = "", data = {}, methodType) {
  const response = await fetch(`http://localhost:3000${route}`, {
    method: methodType,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw await response.json();
  }
}
