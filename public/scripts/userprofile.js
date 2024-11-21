document.getElementById('profile-link').addEventListener('click', loadUserProfile);

// Function to load user profile data from local storage
function loadUserProfile() {
  const userProfileContainer = document.getElementById('user-profile-container');
  const userData = JSON.parse(localStorage.getItem('user')); // Retrieve user data from local cache

  if (userData) {
    // Construct the user profile information in the desired format
    const userProfileHTML = `
      <h2>User Profile</h2>
      <p><strong>UserID:</strong> ${userData.UserID}</p>
      <p><strong>Name:</strong> ${userData.firstName} ${userData.lastName}</p>
      <p><strong>Email:</strong> ${userData.Email}</p>
      <p><strong>Username:</strong> ${userData.userName}</p>
    `;

    // Display the user profile in the container
    userProfileContainer.innerHTML = userProfileHTML;
  } else {
    userProfileContainer.innerHTML = '<p>User profile not found.</p>';
  }
}
