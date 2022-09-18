// $(".ui.labeled.icon.sidebar").sidebar("toggle").transition("slide left");
// var apiKey = QMAeSLw9LphOgRCAK702ASasb6X8HaxCufGsvHaw
var searchButton = $('#customSearchButton');
searchButton.on("click", search2resultURL);

// Enables sidebar hiding and revealing
// https://codepen.io/redshift7/pen/VaKmjq
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
    var searchResultURL = `https://gordon-magill.github.io/NASA_exploration/resultsPage.html?q=${descriptionField.val()}&media_type=image`;
  
    // Conditional statements that add in new query terms if they were added
    if (keywordsField.val()) {
      searchResultURL += `&keywords=${keywordsField.val()}`
    }
  
    if (titleField.val()) {
      searchResultURL += `&title=${titleField.val()}`
    }
  
    if (startYearField.val()) {
      searchResultURL += `&year_start=${startYearField.val()}`
    }
  
    if (endYearField.val()) {
      searchResultURL += `&year_end=${endYearField.val()}`
    }

    // Forward the user on to the constructed result page URL
    document.location.replace(searchResultURL)
  
}

// Uses the URL of the results page to query the NASA API and retrieve content
function URL2result() {
  queryString = document.location.search;
  apiURL = 'https://images-api.nasa.gov/search'+queryString
  
  fetch(apiURL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data.collection.items[0].data[0]);
    var primaryResult = data.collection.items[0].data[0];
    var imgCreatedDate = data.collection.items[0].data[0].date_created;
    console.log(imgCreatedDate);
    var imgDescription = primaryResult.description;
    console.log(imgDescription);
    var imgTitle = primaryResult.title;
    console.log(imgTitle);
    var nasa_id = primaryResult.nasa_id;
    console.log(nasa_id);

    //   Setting the page elements to the retrieved data
    nasaTitleEl.text(imgTitle);
    nasaDescriptionEl.text(imgDescription);
    nasaDateCreatedEl.text(imgCreatedDate);
    //   nasa
    getImage(nasa_id);
  });

}

// function executeSearch() {
//   // Input elements in the search bar
//   var descriptionField = $("#searchBarDescription");
//   var keywordsField = $("#searchBarKeywords");
//   var titleField = $("#searchBarTitle");
//   var startYearField = $("#searchBarStartYear");
//   var endYearField = $("#searchBarEndYear");

//   // Template URL with required query
//   var requestURL = `https://images-api.nasa.gov/search?q=${descriptionField.val()}&media_type=image`;

//   // Conditional statements that add in new query terms if they were added
//   if (keywordsField.val()) {
//     requestURL += `&keywords=${keywordsField.val()}`
//   }

//   if (titleField.val()) {
//     requestURL += `&title=${titleField.val()}`
//   }

//   if (startYearField.val()) {
//     requestURL += `&year_start=${startYearField.val()}`
//   }

//   if (endYearField.val()) {
//     requestURL += `&year_end=${endYearField.val()}`
//   }

//   // Fetching content based on the final request URL
//   fetch(requestURL)
//     .then(function (response) {
//       return response.json();
//     })
//     .then(function (data) {
//       console.log(data.collection.items[0].data[0]);
//       var primaryResult = data.collection.items[0].data[0];
//       var imgCreatedDate = data.collection.items[0].data[0].date_created;
//       console.log(imgCreatedDate);
//       var imgDescription = primaryResult.description;
//       console.log(imgDescription);
//       var imgTitle = primaryResult.title;
//       console.log(imgTitle);
//       var nasa_id = primaryResult.nasa_id;
//       console.log(nasa_id);

//       //   Setting the page elements to the retrieved data
//       nasaTitleEl.text(imgTitle);
//       nasaDescriptionEl.text(imgDescription);
//       nasaDateCreatedEl.text(imgCreatedDate);
//       //   nasa
//       getImage(nasa_id);
//     });
// }

function getImage(nasa_id) {
  fetch(`https://images-api.nasa.gov/asset/${nasa_id}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var imgLink = data.collection.items[2].href; //Index 1 gets the "medium" image
      console.log(imgLink);
      nasaPhotoEl.attr("src", imgLink);
    });
}

URL2result();
