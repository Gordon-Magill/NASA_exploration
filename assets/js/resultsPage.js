// $(".ui.labeled.icon.sidebar").sidebar("toggle").transition("slide left");
// var apiKey = QMAeSLw9LphOgRCAK702ASasb6X8HaxCufGsvHaw
//   var searchButton = "document.blahblach";
// searchbutton.AddEventListener("click", getApi);

// https://codepen.io/redshift7/pen/VaKmjq
$('.ui.sidebar').sidebar({
  context: $('.bottom.segment')
})
.sidebar('attach events', '.menu .item');

// Setting up elements to drop in information from search result
var nasaTitleEl = $('#nasaTitleEl');
var nasaDescriptionEl = $('#nasaDescriptionEl');
var nasaDateCreatedEl = $('#nasaDateCreatedEl');
var nasaCenterEl = $('#nasaCenterEl');
var nasaPhotoEl = $('#nasaPhotoEl');

// Enables sidebar hiding
// $('.customHeader').on('click',toggleSidebar)
// function toggleSidebar(){
//     $(".ui.labeled.icon.sidebar").sidebar("toggle");
// }

function executeSearch() {
  var requestURL = "https://images-api.nasa.gov/search?q=mars";

  fetch(requestURL)
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
      console.log(imgTitle)
      var nasa_id = primaryResult.nasa_id;
      console.log(nasa_id)

    //   Setting the page elements to the retrieved data
      nasaTitleEl.text(imgTitle)
      nasaDescriptionEl.text(imgDescription)
      nasaDateCreatedEl.text(imgCreatedDate)
    //   nasa
      getImage(nasa_id)
    });
}

function getImage(nasa_id) {
    fetch(`https://images-api.nasa.gov/asset/${nasa_id}`)
    .then(function (response) {
        return response.json()
    })
    .then(function(data){
        console.log(data)
        var imgLink = data.collection.items[2].href; //Index 1 gets the "medium" image
        console.log(imgLink)
        nasaPhotoEl.attr('src',imgLink)
    })
}

executeSearch();
