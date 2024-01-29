$(document).ready(function () {
  const genres = [
    "Fiction",
    "Mystery",
    "Thriller",
    "Romance",
    "Fantasy",
    "Science Fiction",
    "Horror",
    "Non-fiction",
    "Biography",
    "History",
    "Self-help",
    "Travel",
    "Cooking",
    "Poetry",
    "Art",
    "Music",
    "Drama",
    "Action",
    "Adventure",
    "Philosophy",
    "Graphic Novel",
  ];

  let currentPage = 1;
  const containersPerPage = 6;
  const totalContainers = genres.length;
  const totalPages = Math.ceil(totalContainers / containersPerPage);

  // Display genre containers for the current page
  function displayContainers() {
    const startIndex = (currentPage - 1) * containersPerPage;
    const endIndex = Math.min(startIndex + containersPerPage, totalContainers);

    $("#genre-container").empty();
    for (let i = startIndex; i < endIndex; i++) {
      const genre = genres[i];
      const randomImage = `https://source.unsplash.com/200x200/?${genre}`;
      $("#genre-container").append(
        `<div class="genre" data-genre="${genre}"><img src="${randomImage}" alt="${genre}"><span>${genre}</span></div>`
      );
    }
  }

  // Display initial set of containers
  displayContainers();

  // Event listener for genre container click
  $(document).on("click", ".genre", function () {
    const genre = $(this).data("genre");
    $(".main").hide(); // Hide main container
    $(".book-cards").show(); // Show book cards container
    $(".back-btn").show(); // Show back button
    fetchBooks(genre);
  });

  // Event listener for previous page button
  $("#prev-page").click(function () {
    if (currentPage > 1) {
      currentPage--;
      displayContainers();
      updatePagination();
    }
  });

  // Event listener for next page button
  $("#next-page").click(function () {
    if (currentPage < totalPages) {
      currentPage++;
      displayContainers();
      updatePagination();
    }
  });

  // Event listener for back button
  $("#back-button").click(function () {
    $(".book-cards").hide(); // Hide book cards container
    $(".main").show(); // Show main container
    $(".back-btn").hide(); // Hide back button
  });

  // Fetch books based on genre
  function fetchBooks(genre) {
    const query = encodeURIComponent(genre);
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=10`;

    $.ajax({
      url: apiUrl,
      method: "GET",
      success: function (response) {
        displayBooks(response.items);
      },
      error: function (err) {
        console.log("Error fetching books:", err);
      },
    });
  }

  // Display books
  function displayBooks(books) {
    let html = "";
    books.forEach((book) => {
      const title = book.volumeInfo.title;
      const authors = book.volumeInfo.authors
        ? book.volumeInfo.authors.join(", ")
        : "Unknown Author";
      const thumbnail = book.volumeInfo.imageLinks
        ? book.volumeInfo.imageLinks.thumbnail
        : "https://via.placeholder.com/150";
      html += `<div class="book-card">
                        <img src="${thumbnail}" alt="${title}">
                        <h3>${title}</h3>
                        <p>By ${authors}</p>
                    </div>`;
    });
    $("#book-cards").html(html);
  }

  // Update page navigation
  function updatePagination() {
    $("#page-counter").text(`Page ${currentPage} of ${totalPages}`);
    if (currentPage === 1) {
      $("#prev-page").prop("disabled", true);
    } else {
      $("#prev-page").prop("disabled", false);
    }
    if (currentPage === totalPages) {
      $("#next-page").prop("disabled", true);
    } else {
      $("#next-page").prop("disabled", false);
    }
  }

  // Initial pagination setup
  updatePagination();
});
