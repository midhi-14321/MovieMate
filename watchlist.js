// Function to display the watchlist
function displayWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const container = document.getElementById("watchlist-container");

  if (!container) {
    console.error("Watchlist container not found!");
    return;
  }

  if (watchlist.length === 0) {
    container.innerHTML = "<p>Your watchlist is empty.</p>";
    return;
  }

  container.innerHTML = watchlist
    .map(
      (movie) => `
          <div class="col-md-3 mb-4">
            <div class="movie-card">
              <a href="movie-details.html?id=${movie.id}">
                <img src="${movie.primaryImage}" alt="${movie.primaryTitle}">
                <h5>${movie.primaryTitle}</h5>
                <p>Year: ${movie.startYear}</p>
                <p class='rate'><i class="fas fa-star"></i><span class="rating">${movie.averageRating}</span></p>
              </a>
              <button class="btn btn-danger remove-from-watchlist" data-movie-id="${movie.id}">Remove</button>
            </div>
          </div>
        `
    )
    .join("");

  // Add event listeners to the Remove buttons
  addRemoveButtonEventListeners();
}

// Function to add event listeners to Remove buttons
function addRemoveButtonEventListeners() {
  const removeButtons = document.querySelectorAll(".remove-from-watchlist");

  removeButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent default button behavior
      const movieId = this.getAttribute("data-movie-id"); // Get the movie ID
      removeFromWatchlist(movieId); // Remove the movie from the watchlist
    });
  });
}

// Function to remove a movie from the watchlist
function removeFromWatchlist(movieId) {
  let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];

  // Filter out the movie with the given ID
  watchlist = watchlist.filter((movie) => String(movie.id) !== String(movieId));

  // Update localStorage
  localStorage.setItem("watchlist", JSON.stringify(watchlist));

  // Show a confirmation message
  alert("Movie removed from watchlist!");

  // Refresh the watchlist display
  displayWatchlist();
}

// Load the watchlist when the page loads
document.addEventListener("DOMContentLoaded", function () {
  displayWatchlist();
});
