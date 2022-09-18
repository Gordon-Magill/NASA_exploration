// Search button in the left sidebar
var searchButton = $("#customSearchButton");
searchButton.on("click", search2resultURL);

// Clear search history button in left sidebar
var clearButton = $("#clearHistoryButton");
clearButton.on("click", clearSearchHistory);

// Enables sidebar hiding and revealing
// Based on https://codepen.io/redshift7/pen/VaKmjq
$(".ui.sidebar")
  .sidebar({
    context: $(".bottom.segment"),
  })
  .sidebar("attach events", ".menu .item");

// Setting up elements to drop in information from search result
var nasaTitleEl = $("#nasaTitleEl");
var nasaDescriptionEl = $("#nasaDescriptionEl");
var nasaDateCreatedEl = $("#nasaDateCreatedEl");
var nasaCenterEl = $("#nasaCenterEl");
var nasaPhotoEl = $("#nasaPhotoEl");

// Uses the URL of the results page to query the NASA API and retrieve content
function URL2result() {
  // Grab the query string and generate the API link
  queryString = document.location.search;
  apiURL = "https://images-api.nasa.gov/search" + queryString;

  // Fetch NASA content
  fetch(apiURL)
    .then(function (response) {
      // console.log(response)

      // In case of bad response, send user to bad search page
      if (response.status >= 400) {
        document.location.replace(
          "./ErrorResultPage.html"
        );
      }

      // Parse the response as JSON
      return response.json();
    })
    .then(function (data) {
      // Grab elements out of the JSON return structure
      var primaryResult = data.collection.items[0].data[0];
      var imgCreatedDate = data.collection.items[0].data[0].date_created;
      var imgDescription = primaryResult.description;
      var imgTitle = primaryResult.title;
      var nasa_id = primaryResult.nasa_id;

      // Setting the page elements to the retrieved data
      nasaTitleEl.text(imgTitle);
      nasaDescriptionEl.html(imgDescription);
      nasaDateCreatedEl.text(imgCreatedDate);

      // Since the API doesn't directly return the image link, retrieve it separately
      getImage(nasa_id);
    });
}

// Retrieves and renders a select image from NASA's image database
function getImage(nasa_id) {
  // Fetch the image based on the nasa_id gleaned from the last API call
  fetch(`https://images-api.nasa.gov/asset/${nasa_id}`)
    .then(function (response) {
      console.log(response);

      //Redirect upon bad response
      if (response.status >= 400) {
        document.location.replace(
          "./ErrorResultPage.html"
        );
      }

      // Parse the response as JSON
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      // Indexing of the image link gives different sizes -> 0 is always available, but is the largest size (original)
      var imgLink = data.collection.items[0].href;
      console.log(imgLink.slice(imgLink.length-3))

      // Check if image is a tiff and go to the next largest image an alternative
      if (imgLink.slice(imgLink.length-3) == 'tif') {
        var imgLink = data.collection.items[1].href;
      }

      console.log("Image link: " + imgLink);
      nasaPhotoEl.attr("src", imgLink);

      // Since request was successful, add the result to the search history
      addToSearchHistory();
    });
}

// Uses localStorage to save the search history of the NASA API
function addToSearchHistory() {
  // Grab existing search history (or empty array as backup)
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
  console.log(searchHistory);

  // Store the query parameters that led to the successful page render
  var currentQuery = document.location.search;

  // Don't add to search history if the query is already present
  for (i = 0; i < searchHistory.length; i++) {
    if (searchHistory[i] === currentQuery) {
      console.log(
        currentQuery +
          " was already in search history, not appending new element"
      );
      return;
    }
  }

  // Add the new history element
  searchHistory.push(currentQuery);

  // Save the new searchHistory value to localStorage
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));

  // Now that there's new searchHistory content, refresh the content on the page
  refreshSearchHistory();
}

// Upon page load, grab the search result...
URL2result();
//...and if page wasn't redirected, then show the search history on the left
renderSearchHistory();
