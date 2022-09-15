// $(".ui.labeled.icon.sidebar").sidebar("toggle").transition("slide left");

//   var searchButton = "document.blahblach";
// searchbutton.AddEventListener("click", getApi);

function getApi() {
  var requestURL = "https://images-api.nasa.gov/search?q=mars";
//   var requestURL = "https://images-api.nasa.gov/search?api_key=QMAeSLw9LphOgRCAK702ASasb6X8HaxCufGsvHaw&q=mars";

  fetch(requestURL)
    .then(function (response) {
      return response.json();
    })
    // Loopy Thing
    .then(function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        var bacsRow = document.getElementbyid("Name");
        var Data = document.getElementbyid("Metadata1");
        var Data = document.getElementById("Metadata2");
        var data = document.getElementbyid("source");
        var tableData = document.getElementbyid("Metadata1");
        var tableData = document.getElementById("Metadata2");
      }
      {
        //Chang the links??
        link.textContent = data[i].html_url;
        link.href = datat[i].html_url;

        //Append stuff
      }
    });
}

getApi()
