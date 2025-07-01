const url = "https://imdb236.p.rapidapi.com/imdb/top250-movies";
const apiKey = "9f1bc49f99mshba75d3d99d3b5fep12f92ejsnd317f82277dab";
const localStorageKey = "imdbTop50Movies";
const localStorageActionKey = "imdbTop250ActionMovies";
const localStorageThrillerKey = "imdbTop250ThrillerMovies";
const localStorageDramaKey = "imdbTop250DramaMovies";
const localStorageRomanceKey = "imdbTop250RomanceMovies";
async function fetchMovies() {
  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "imdb236.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("API Response:", data);

    // Check if the response contains movies
    const movies = data.movies || data.results || data;
    if (!movies || movies.length === 0) {
      throw new Error("No movies found in the response");
    }

    //the first 50 movies in localStorage
    const top50Movies = movies.slice(0, 50);
    localStorage.setItem(localStorageKey, JSON.stringify(top50Movies));
    console.log("Top 50 movies stored in localStorage.");

    // Filter action movies from the top 250 movies
    const actionMovies = movies.filter(
      (movie) => movie.genres && movie.genres.includes("Action")
    );
    localStorage.setItem(localStorageActionKey, JSON.stringify(actionMovies));
    console.log("Action movies stored in localStorage.");

    // Filter thriller movies from the full list of 250 movies
    const thrillerMovies = movies.filter(
      (movie) => movie.genres && movie.genres.includes("Thriller")
    );
    localStorage.setItem(
      localStorageThrillerKey,
      JSON.stringify(thrillerMovies)
    );
    console.log("Thriller movies stored in localStorage.");

    // Filter drama movies from the full list of 250 movies
    const dramaMovies = movies.filter(
      (movie) => movie.genres && movie.genres.includes("Drama")
    );
    localStorage.setItem(localStorageDramaKey, JSON.stringify(dramaMovies));
    console.log("Drama movies stored in localStorage.");

    // Filter romance movies from the full list of 250 movies
    const romanceMovies = movies.filter(
      (movie) => movie.genres && movie.genres.includes("Romance")
    );
    localStorage.setItem(localStorageRomanceKey, JSON.stringify(romanceMovies));
    console.log("Romance movies stored in localStorage.");

    // Display movies
    displayMovies(top50Movies, "carousel-container");
    displayMovies(actionMovies, "action-carousel-container");
    displayMovies(thrillerMovies, "thriller-carousel-container");
    displayMovies(dramaMovies, "drama-carousel-container");
    displayMovies(romanceMovies, "romance-carousel-container");
  } catch (error) {
    console.error("Error fetching movies:", error);
    const container = document.getElementById("carousel-container");
    container.innerHTML = `<p class="error">Failed to load movies. Please try again later.</p>`;
  }
}

function displayMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  movies.forEach((movie) => {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const primaryTitle = movie.primaryTitle || "Title Not Available";
    const primaryImage =
      movie.primaryImage || "https://via.placeholder.com/250";
    const startYear = movie.startYear || "N/A";
    const rating = movie.averageRating || "N/A";
    card.innerHTML = `
          <a href="movie-details.html?id=${movie.id}">
              <img src="${primaryImage}" alt="${primaryTitle}">
              <h5>${primaryTitle}</h5>
              <p>Year: ${startYear}</p>
              <p class='rate'><i class="fas fa-star"></i><span class="rating">${rating}</span></p> 
          </a>
          <button class="btn btn-primary add-to-watchlist" data-movie-id="${movie.id}">Add to Watchlist</button>
      `;

    container.appendChild(card);
  });

  console.log(`Displayed movies in ${containerId}:`, movies); // Debugging
  addWatchlistEventListeners();
}

// Check if movies are stored in localStorage
function loadMovies() {
  const storedMovies = localStorage.getItem(localStorageKey);
  const storedActionMovies = localStorage.getItem(localStorageActionKey);
  const storedThrillerMovies = localStorage.getItem(localStorageThrillerKey);
  const storedDramaMovies = localStorage.getItem(localStorageDramaKey);
  const storedRomanceMovies = localStorage.getItem(localStorageRomanceKey);

  if (storedMovies) {
    // If movies are stored, parse and display them
    const movies = JSON.parse(storedMovies);
    console.log("Movies loaded from localStorage.");
    displayMovies(movies, "carousel-container");
  } else {
    // If no movies are stored, fetch them from the API
    console.log("No movies found in localStorage. Fetching from API...");
    fetchMovies();
  }

  if (storedActionMovies) {
    // If action movies are stored, parse and display them
    const actionMovies = JSON.parse(storedActionMovies);
    console.log("Action movies loaded from localStorage.");
    displayMovies(actionMovies, "action-carousel-container");
  } else {
    // If no action movies are stored, fetch them from the API
    console.log("No action movies found in localStorage. Fetching from API...");
    fetchMovies();
  }

  if (storedThrillerMovies) {
    // If thriller movies are stored, parse and display them
    const thrillerMovies = JSON.parse(storedThrillerMovies);
    console.log("Thriller movies loaded from localStorage.");
    displayMovies(thrillerMovies, "thriller-carousel-container");
  } else {
    // If no thriller movies are stored, fetch them from the API
    console.log(
      "No thriller movies found in localStorage. Fetching from API..."
    );
    fetchMovies();
  }
  if (storedDramaMovies) {
    // If drama movies are stored, parse and display them
    const dramaMovies = JSON.parse(storedDramaMovies);
    console.log("drama movies loaded from localStorage.");
    displayMovies(dramaMovies, "drama-carousel-container");
  } else {
    // If no drama movies are stored, fetch them from the API
    console.log("No drama movies found in localStorage. Fetching from API...");
    fetchMovies();
  }
  if (storedRomanceMovies) {
    // If romance movies are stored, parse and display them
    const romanceMovies = JSON.parse(storedRomanceMovies);
    console.log("romance movies loaded from localStorage.");
    displayMovies(romanceMovies, "romance-carousel-container");
  } else {
    // If no romance movies are stored, fetch them from the API
    console.log(
      "No romance movies found in localStorage. Fetching from API..."
    );
    fetchMovies();
  }
}

// Sliding functionality
let currentIndex = 0;
let actionCurrentIndex = 0;
let thrillerCurrentIndex = 0;
let dramaCurrentIndex = 0;
let romanceCurrentIndex = 0;

function slideCarousel(direction, containerId) {
  const container = document.getElementById(containerId);

  // Check if the container exists
  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  // Check if there are any movie cards in the container
  const cards = container.querySelectorAll(".movie-card");
  console.log(`Cards in ${containerId}:`, cards); // Debugging
  if (cards.length === 0) {
    console.error(`No movie cards found in container "${containerId}".`);
    return;
  }

  const cardWidth = cards[0].offsetWidth + 20; // Card width + margin
  const slideDistance = cardWidth * 2; // Slide by 2 cards
  const maxIndex = (cards.length - 1) * cardWidth;

  // Update the current index based on the container
  if (containerId === "carousel-container") {
    currentIndex += direction * slideDistance;
    currentIndex = Math.max(0, Math.min(currentIndex, maxIndex));
    container.style.transform = `translateX(-${currentIndex}px)`;
  } else if (containerId === "action-carousel-container") {
    actionCurrentIndex += direction * slideDistance;
    actionCurrentIndex = Math.max(0, Math.min(actionCurrentIndex, maxIndex));
    container.style.transform = `translateX(-${actionCurrentIndex}px)`;
  } else if (containerId === "thriller-carousel-container") {
    thrillerCurrentIndex += direction * slideDistance;
    thrillerCurrentIndex = Math.max(
      0,
      Math.min(thrillerCurrentIndex, maxIndex)
    );
    container.style.transform = `translateX(-${thrillerCurrentIndex}px)`;
  } else if (containerId === "drama-carousel-container") {
    dramaCurrentIndex += direction * slideDistance;
    dramaCurrentIndex = Math.max(0, Math.min(dramaCurrentIndex, maxIndex));
    container.style.transform = `translateX(-${dramaCurrentIndex}px)`;
  } else if (containerId === "romance-carousel-container") {
    romanceCurrentIndex += direction * slideDistance;
    romanceCurrentIndex = Math.max(0, Math.min(romanceCurrentIndex, maxIndex));
    container.style.transform = `translateX(-${romanceCurrentIndex}px)`;
  }
}
//the searchMovieInLocalStorage function
function searchMovieInLocalStorage(query) {
  const localStorageKeys = [
    "imdbTop50Movies",
    "imdbTop250ActionMovies",
    "imdbTop250DramaMovies",
    "imdbTop250RomanceMovies",
    "imdbTop250ThrillerMovies",
  ];

  // Search for the movie in all localStorage keys
  for (const key of localStorageKeys) {
    const moviesData = localStorage.getItem(key);

    if (moviesData) {
      try {
        const movies = JSON.parse(moviesData);

        if (Array.isArray(movies)) {
          // Find the movie with a matching title (case-insensitive)
          const foundMovie = movies.find(
            (movie) =>
              movie.primaryTitle &&
              movie.primaryTitle.toLowerCase().includes(query.toLowerCase())
          );

          if (foundMovie) {
            return foundMovie; // Return the movie if found
          }
        }
      } catch (error) {
        console.error(`Error parsing movies data from ${key}:`, error);
      }
    }
  }

  return null; // Return null if no movie is found
}

//  the search form event listener
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page

    const searchQuery = document.getElementById("searchInput").value.trim(); // Get the search query
    if (searchQuery) {
      const movie = searchMovieInLocalStorage(searchQuery); // Search for the movie
      if (movie) {
        // Redirect to movie-details.html with the movie ID
        window.location.href = `movie-details.html?id=${movie.id}`;
      } else {
        alert("No movie found with that name."); // Show error if no movie is found
      }
    } else {
      alert("Please enter a movie name to search."); // Handle empty search
    }
  });

// event listener for the logout link
document.getElementById("logout").addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default link behavior

  // Clear localStorage if want
  // localStorage.clear();

  // Redirect to index.html
  window.location.href = "index.html";
});

function saveUserProfile(username, bio, preferences) {
  const userProfile = {
    username: username,
    bio: bio,
    preferences: preferences,
  };
  localStorage.setItem("userProfile", JSON.stringify(userProfile));
  console.log("User profile saved successfully!");
}

// Get user profile from localStorage
function getUserProfile() {
  const userProfile = localStorage.getItem("userProfile");
  if (userProfile) {
    return JSON.parse(userProfile);
  } else {
    return null; // No profile found
  }
}

// Display user profile in the modal
function displayUserProfile() {
  const userProfile = getUserProfile();
  if (userProfile) {
    const profileDetails = `
        <p><strong>Username:</strong> ${userProfile.username}</p>
        <p><strong>Bio:</strong> ${userProfile.bio}</p>
        <p><strong>Movie Preferences:</strong> ${userProfile.preferences.join(
          ", "
        )}</p>
      `;

    // Insert profile details into the modal
    document.getElementById("profileModalBody").innerHTML = profileDetails;

    // Show the modal
    const profileModal = new bootstrap.Modal(
      document.getElementById("profileModal")
    );
    profileModal.show();
  } else {
    alert("No profile details found. Please update your profile.");
  }
}

// Add event listener to "View Profile"
document
  .getElementById("viewProfile")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the default link behavior
    displayUserProfile();
  });

// Add event listeners to "Add to Watchlist" buttons

function addWatchlistEventListeners() {
  const addToWatchlistButtons = document.querySelectorAll(".add-to-watchlist");

  addToWatchlistButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      const movieId = this.getAttribute("data-movie-id");
      addToWatchlist(movieId);
    });
  });
}

// Add a movie to the watchlist
// function addToWatchlist(movieId) {
//   const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
//   const movie = findMovieById(movieId);

//   if (movie) {
//     console.log("Movie ID from button:", movieId, typeof movieId); // Debugging
//     console.log(
//       "Movie IDs in watchlist:",
//       watchlist.map((m) => m.id)
//     );

//     // Convert both IDs to strings for consistent comparison
//     const isMovieInWatchlist = watchlist.some(
//       (m) => String(m.id) === String(movieId)
//     );

//     if (!isMovieInWatchlist) {
//       watchlist.push(movie);
//       localStorage.setItem("watchlist", JSON.stringify(watchlist));
//       alert("Movie added to watchlist!");
//       updateWatchlistDropdown();
//     } else {
//       alert("Movie is already in the watchlist.");
//     }
//   } else {
//     alert("Movie not found.");
//   }
// }

function addToWatchlist(movieId) {
  const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
  const movie = findMovieById(movieId);

  if (movie) {
    console.log("Movie ID from button:", movieId, typeof movieId); // Debugging
    console.log(
      "Movie IDs in watchlist:",
      watchlist.map((m) => m.id)
    ); // Debugging

    // Normalize IDs by converting to strings and trimming
    const normalizedMovieId = String(movieId).trim();
    const isMovieInWatchlist = watchlist.some((m) => {
      const normalizedId = String(m.id).trim();
      return normalizedId === normalizedMovieId;
    });

    if (!isMovieInWatchlist) {
      watchlist.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(watchlist));
      alert("Movie added to watchlist!");
      updateWatchlistDropdown();
    } else {
      alert("Movie is already in the watchlist.");
    }
  } else {
    alert("Movie not found.");
  }
}
function findMovieById(movieId) {
  const localStorageKeys = [
    "imdbTop50Movies",
    "imdbTop250ActionMovies",
    "imdbTop250DramaMovies",
    "imdbTop250RomanceMovies",
    "imdbTop250ThrillerMovies",
  ];

  for (const key of localStorageKeys) {
    const moviesData = localStorage.getItem(key);

    if (moviesData) {
      try {
        const movies = JSON.parse(moviesData);

        if (Array.isArray(movies)) {
          console.log(`Searching in key: ${key}`); // Debugging
          const foundMovie = movies.find((movie) => {
            const isMatch = String(movie.id).trim() === String(movieId).trim();
            console.log(`Comparing ${movie.id} with ${movieId}: ${isMatch}`); // Debugging
            return isMatch;
          });

          if (foundMovie) {
            console.log("Movie found:", foundMovie); // Debugging
            return foundMovie;
          }
        }
      } catch (error) {
        console.error(`Error parsing movies data from ${key}:`, error);
      }
    }
  }

  console.log("Movie not found in any key."); // Debugging
  return null;
}

function updateWatchlistDropdown() {
  const watchlistDropdown = document.getElementById("watchlistDropdown");

  // Always show the "View Watchlist" link
  watchlistDropdown.innerHTML = `
    <li><a class="dropdown-item" href="watchlist.html">View Watchlist</a></li>
  `;
}
window.onload = function () {
  loadMovies();
  updateWatchlistDropdown();
};
