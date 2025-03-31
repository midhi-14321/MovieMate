document.addEventListener("DOMContentLoaded", () => {
  // Profile modal elements
  const profileModalBody = document.getElementById("profileModalBody");
  const viewProfileBtn = document.getElementById("viewProfile");
  const editProfileBtn = document.getElementById("editProfile");
  const logoutBtn = document.getElementById("logout");

  // Load Profile
  function loadProfile() {
    const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {
      username: "Guest",
      bio: "No bio available",
      favoriteGenres: "Not set",
    };

    profileModalBody.innerHTML = `
        <p><strong>Username:</strong> ${userProfile.username}</p>
        <p><strong>Bio:</strong> ${userProfile.bio}</p>
        <p><strong>Favorite Genres:</strong> ${userProfile.favoriteGenres}</p>
        <button class="btn btn-primary" onclick="openEditProfile()">Edit Profile</button>
      `;
  }

  // Open Profile Modal
  viewProfileBtn.addEventListener("click", () => {
    loadProfile();
    new bootstrap.Modal(document.getElementById("profileModal")).show();
  });

  // Open Edit Profile Form
  window.openEditProfile = function () {
    profileModalBody.innerHTML = `
        <label>Username:</label>
        <input type="text" id="editUsername" class="form-control" value="${
          localStorage.getItem("userProfile")
            ? JSON.parse(localStorage.getItem("userProfile")).username
            : ""
        }" required>
        <label>Bio:</label>
        <textarea id="editBio" class="form-control">${
          localStorage.getItem("userProfile")
            ? JSON.parse(localStorage.getItem("userProfile")).bio
            : ""
        }</textarea>
        <label>Favorite Genres:</label>
        <input type="text" id="editGenres" class="form-control" value="${
          localStorage.getItem("userProfile")
            ? JSON.parse(localStorage.getItem("userProfile")).favoriteGenres
            : ""
        }">
        <button class="btn btn-success mt-2" onclick="saveProfile()">Save</button>
      `;
  };

  // Save Profile
  window.saveProfile = function () {
    const updatedProfile = {
      username: document.getElementById("editUsername").value,
      bio: document.getElementById("editBio").value,
      favoriteGenres: document.getElementById("editGenres").value,
    };

    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    alert("Profile updated successfully!");
    loadProfile();
  };

  // Logout Function
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userProfile");
    alert("Logged out successfully!");
    window.location.href = "index.html"; // Redirect to login page
  });
});
