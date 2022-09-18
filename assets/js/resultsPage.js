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

// Function that takes search bar fields and redirects the user to the
// results page for the results to be displayed from the URL query parameters

function search2resultURL() {
  // Input elements in the search bar
  var descriptionField = $("#searchBarDescription");
  var keywordsField = $("#searchBarKeywords");
  var titleField = $("#searchBarTitle");
  var startYearField = $("#searchBarStartYear");
  var endYearField = $("#searchBarEndYear");

  // Template URL with required query
  var searchResultURL = `https://gordon-magill.github.io/NASA_exploration/resultsPage.html?q=${descriptionField.val()}&media_type=image`; //MAKE SURE THIS IS THE DEPLOYED ONE
  // var searchResultURL = `http://127.0.0.1:5500/group_projects/nasa_exploration/resultsPage.html?q=${descriptionField.val()}&media_type=image`;

  // Conditional statements that add in new query terms if they were added
  if (keywordsField.val()) {
    searchResultURL += `&keywords=${keywordsField.val()}`;
  }

  if (titleField.val()) {
    searchResultURL += `&title=${titleField.val()}`;
  }

  if (startYearField.val()) {
    searchResultURL += `&year_start=${startYearField.val()}`;
  }

  if (endYearField.val()) {
    searchResultURL += `&year_end=${endYearField.val()}`;
  }

  // Forward the user on to the constructed result page URL
  document.location.replace(searchResultURL);
}

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
          "https://gordon-magill.github.io/NASA_exploration/ErrorResultPage.html"
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
          "https://gordon-magill.github.io/NASA_exploration/ErrorResultPage.html"
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

// Takes the search history in localStorage and uses it to render new elements on the search history
function renderSearchHistory() {
  var sideBarParent = $("#sideBarParent");
  var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];

  // Abort if there is no search history to render
  if (searchHistory.length < 1) {
    return;
  }

  // Function for grabbing query parameters from a saved query string
  // Based off code from https://fellowtuts.com/jquery/get-query-string-values-url-parameters-javascript/
  function getQueryObject(queryString) {
    var qs = queryString.substring(queryString.indexOf("?") + 1).split("&");
    for (var i = 0, result = {}; i < qs.length; i++) {
      qs[i] = qs[i].split("=");
      result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
  }

  // Cycle through search history elements and create cards for each
  for (k = 0; k < searchHistory.length; k++) {
    // Fetch query parameters from the query string
    var queryParams = getQueryObject(searchHistory[k]);
    var nProps = Object.keys(queryParams).length;

    // Creating elements of the card
    var searchHistoryLink = `https://gordon-magill.github.io/NASA_exploration/resultsPage.html${searchHistory[k]}`;
    var newHistoryCard = $(
      `<a class="ui raised card" href="${searchHistoryLink}">`
    );
    var cardContent = $('<div class="content">');
    var cardTitle = $('<div class="header">');
    cardTitle.text(queryParams["q"]);
    var cardDescription = $('<div class="description">');
    var cardDescriptionText = $("<p>");

    // Assembling card components into the final card
    cardContent.append(cardTitle);

    // Add description to history card if optional query parameters were used
    if (nProps > 1) {
      console.log("Rendering greater description");
      for (j = 1; j < nProps; j++) {
        if (Object.keys(queryParams)[j] !== "media_type") {
          var paramPTag = $("<p>");
          paramPTag.text(
            `${Object.keys(queryParams)[j]}: ${
              queryParams[Object.keys(queryParams)[j]]
            }`
          );
          cardDescription.append(paramPTag);
        }
        console.log(j);
      }
      // cardDescriptionText.text(descriptionText)
      cardDescription.append(cardDescriptionText);
      cardContent.append(cardDescription);
    }

    // Add the variable content to the card
    newHistoryCard.append(cardContent);

    // Actually appending the new card
    sideBarParent.append(newHistoryCard);
  }
}

// Refreshes the content of the search history to make sure it's up to date
function refreshSearchHistory() {
  var sideBarParent = $("#sideBarParent");
  sideBarParent.empty();
  renderSearchHistory();
}

// Completely wipe the search history, both the visual elements and localStorage
function clearSearchHistory() {
  localStorage.setItem("searchHistory", JSON.stringify([]));
  var sideBarParent = $("#sideBarParent");
  sideBarParent.empty();
}

// Upon page load, grab the search result...
URL2result();
//...and if page wasn't redirected, then show the search history on the left
renderSearchHistory();
