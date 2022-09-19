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

function renderSearchHistory() {
  console.log('renderSearchHistory() activated')
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
    var searchHistoryLink = `./resultsPage.html${searchHistory[k]}`;
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
      // console.log("Rendering greater description");
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
        // console.log(j);
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

// Takes search fields and constructs the URL of the result page that also encodes the NASA API query string
function search2resultURL() {
  // Input elements in the search bar
  var descriptionField = $("#searchBarDescription");
  var keywordsField = $("#searchBarKeywords");
  var titleField = $("#searchBarTitle");
  var startYearField = $("#searchBarStartYear");
  var endYearField = $("#searchBarEndYear");

  // Template URL with required query
  var searchResultURL = `./resultsPage.html?q=${descriptionField.val()}&media_type=image`; //MAKE SURE THIS IS THE DEPLOYED ONE

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

// Always load the search history on all pages
refreshSearchHistory()