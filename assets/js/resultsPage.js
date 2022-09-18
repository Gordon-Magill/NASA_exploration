// $(".ui.labeled.icon.sidebar").sidebar("toggle").transition("slide left");
// var apiKey = QMAeSLw9LphOgRCAK702ASasb6X8HaxCufGsvHaw
var searchButton = $('#customSearchButton');
searchButton.on("click", search2resultURL);

var clearButton = $('#clearHistoryButton');
clearButton.on('click',clearSearchHistory)

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
    var searchResultURL = `https://gordon-magill.github.io/NASA_exploration/resultsPage.html?q=${descriptionField.val()}&media_type=image`; //MAKE SURE THIS IS THE DEPLOYED ONE
    // var searchResultURL = `http://127.0.0.1:5500/group_projects/nasa_exploration/resultsPage.html?q=${descriptionField.val()}&media_type=image`;
  
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
    console.log(response)

    // In case of bad response, send user to bad search page
    if (response.status >= 400) {
      document.location.replace('https://gordon-magill.github.io/NASA_exploration/ErrorResultPage.html')
    }
    return response.json();
  })
  .then(function (data) {
    // console.log(data.collection.items[0].data[0]);
    var primaryResult = data.collection.items[0].data[0];
    var imgCreatedDate = data.collection.items[0].data[0].date_created;
    // console.log(imgCreatedDate);
    var imgDescription = primaryResult.description;
    // console.log(imgDescription);
    var imgTitle = primaryResult.title;
    // console.log(imgTitle);
    var nasa_id = primaryResult.nasa_id;
    // console.log(nasa_id);

    //   Setting the page elements to the retrieved data
    nasaTitleEl.text(imgTitle);
    nasaDescriptionEl.html(imgDescription);
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

      //Redirect upon bad response
      if (response.status >= 400) {
        document.location.replace('https://gordon-magill.github.io/NASA_exploration/ErrorResultPage.html')
      }

      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var imgLink = data.collection.items[0].href; //Index 1 gets the "medium" image

      // TODO: Add fix for case where returned file is actually more metadata

      console.log('Image link: '+imgLink)
      // console.log('Parsed image link:')
      // console.log(JSON.parse(imgLink))
      nasaPhotoEl.attr("src", imgLink);

      // Since request was successful, add the result to the search history
      addToSearchHistory()
    });
}

function addToSearchHistory() {
  // Grab existing search history (or empty array as backup)
  var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  console.log(searchHistory)

  // Store the query parameters that led to the successful page render
  var currentQuery = document.location.search;

  // Don't add to search history if the query is already present
  for (i=0;i<searchHistory.length;i++) {
    if (searchHistory[i]===currentQuery) {
      console.log(currentQuery+' was already in search history, not appending new element')
      return;
    }
  }

  searchHistory.push(document.location.search)

  localStorage.setItem('searchHistory',JSON.stringify(searchHistory))

  refreshSearchHistory()
}

// Takes the search history and uses it to render new elements on the search history
function renderSearchHistory() {
  var sideBarParent = $('#sideBarParent')
  var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

  // Abort if there is no search history to render
  if (searchHistory.length<1) {
    return;
  }

  // Function for grabbing query parameters from a saved query string
  // Based off code from https://fellowtuts.com/jquery/get-query-string-values-url-parameters-javascript/
  function getQueryObject(queryString){
    var qs = queryString.substring(queryString.indexOf('?') + 1).split('&');
    for(var i = 0, result = {}; i < qs.length; i++){
        qs[i] = qs[i].split('=');
        result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
  }

  // Cycle through search history elements and create cards for each
  for (k=0;k<searchHistory.length; k++) {

    // Fetch query parameters from the query string
    var queryParams = getQueryObject(searchHistory[k])
    // console.log(Object.keys(queryParams)[0])
    var nProps = Object.keys(queryParams).length;
    console.log(`nProps: ${nProps}`)

    // Creating elements of the card
    var searchHistoryLink = `https://gordon-magill.github.io/NASA_exploration/resultsPage.html${searchHistory[k]}`
    var newHistoryCard = $(`<a class="ui raised card" href="${searchHistoryLink}">`)
    var cardContent = $('<div class="content">')
    var cardTitle = $('<div class="header">')
    cardTitle.text(queryParams['q'])
    var cardDescription = $('<div class="description">')
    var cardDescriptionText = $('<p>')
    

    // Assembling card components into the final card
    
    cardContent.append(cardTitle)

    // Add description if optional query parameters were used
    if (nProps>1) {
      console.log('Rendering greater description')
      for (j=1;j<nProps;j++) {
        if (Object.keys(queryParams)[j] !== 'media_type') {
          var paramPTag = $('<p>')
          paramPTag.text(`${Object.keys(queryParams)[j]}: ${queryParams[Object.keys(queryParams)[j]]}`)
          cardDescription.append(paramPTag)

        }
       console.log(j) 
      }
      // cardDescriptionText.text(descriptionText)
      cardDescription.append(cardDescriptionText)
      cardContent.append(cardDescription)
    }
    newHistoryCard.append(cardContent)

    // Actually appending the new card
    sideBarParent.append(newHistoryCard)



  }

  return;
}

function refreshSearchHistory() {
  var sideBarParent = $('#sideBarParent')
  sideBarParent.empty();
  renderSearchHistory()
}

function clearSearchHistory() {
  localStorage.setItem('searchHistory',JSON.stringify([]))
  var sideBarParent = $('#sideBarParent')
  sideBarParent.empty();
}

// Upon page load, grab the search result...
URL2result();
//...and if page wasn't redirected, then show the search history in on the left
renderSearchHistory();

