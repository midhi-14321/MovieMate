const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

// List of localStorage keys to search for the movie
const localStorageKeys = [
  "imdbTop50Movies",
  "imdbTop250ActionMovies",
  "imdbTop250DramaMovies",
  "imdbTop250RomanceMovies",
  "imdbTop250ThrillerMovies",
];

// Fetch movie details from localStorage
function fetchMovieDetails(movieId) {
  let movie = null;

  // Search for the movie in all localStorage keys
  for (const key of localStorageKeys) {
    const moviesData = localStorage.getItem(key);

    // Check if movies exist in localStorage
    if (moviesData) {
      try {
        const movies = JSON.parse(moviesData);

        // Check if movies is an array
        if (Array.isArray(movies)) {
          // Find the movie with the matching ID
          const foundMovie = movies.find((m) => m.id === movieId);
          if (foundMovie) {
            movie = foundMovie;
            break; // Exit the loop if the movie is found
          }
        }
      } catch (error) {
        console.error(`Error parsing movies data from ${key}:`, error);
      }
    }
  }

  // Check if the movie was found
  if (movie) {
    displayMovieDetails(movie);
  } else {
    console.error(`Movie with ID ${movieId} not found in localStorage.`);
    displayError(`Movie with ID ${movieId} not found in localStorage.`);
  }
}

// Display movie details on the page
function displayMovieDetails(movie) {
  const movieDetails = document.getElementById("movie-details");

  // Check if the movie object is valid
  if (!movie) {
    movieDetails.innerHTML = `<p class="text-danger">No movie data found.</p>`;
    return;
  }

  // Safely handle the genres field
  const genres =
    movie.genres && Array.isArray(movie.genres)
      ? movie.genres.join(", ")
      : "No genres available";

  // Use a placeholder image URL if primaryImage is missing
  const imageUrl =
    movie.primaryImage ||
    "https://via.placeholder.com/300x450?text=No+Image+Available";

  // Display movie details
  movieDetails.innerHTML = `
    <h1>${movie.primaryTitle || "No title available"}</h1>
    <div id='movie-poster'>
      <img src="${imageUrl}" alt="${
    movie.primaryTitle || "Movie"
  }" class="img-fluid">
    </div>
    <p><strong>Synopsis:</strong> ${
      movie.description || "No description available"
    }</p>
    <p><strong>Release Year:</strong> ${movie.startYear || "Unknown"}</p>
    <p><strong>Runtime:</strong> ${movie.runtimeMinutes || "N/A"} minutes</p>
    <p><strong>Genres:</strong> ${genres}</p>
    <p><strong>Rating:</strong> ${movie.averageRating || "N/A"}/10 (${
    movie.numVotes || "0"
  } votes)</p>
  `;
}

// Display an error message
function displayError(message) {
  const movieDetails = document.getElementById("movie-details");
  movieDetails.innerHTML = `
    <p class="text-danger">${message}</p>
  `;
}

// Load movie details when the page loads
if (movieId) {
  fetchMovieDetails(movieId);
}
// else {
//   alert("Movie ID not found in URL.");
// }
