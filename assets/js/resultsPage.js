function getApi() {

var requestURL = ("https://api.nasa.gov/planetary/apod?api_key=QMAeSLw9LphOgRCAK702ASasb6X8HaxCufGsvHaw")
var searchbutton = ("document.blahblach")
fetch (requestURL)
.then(function(result) {return result.json();})
// Loopy Thing  
.then (function (data) {console.log(data)
for (var i=0; i < data.length; i++) {
    var bacsRow = document.getElementbyid('Name')
    var Data = document.getElementbyid ('Metadata1')
    var Data = document.getElementById('Metadata2')
    var data = document.getElementbyid('source')
    var tableData = document.getElementbyid ('Metadata1')
    var tableData = document.getElementById('Metadata2')
}   
{ //Chang the links??
    link.textContent = data[i].html_url;
    link.href = datat[i].html_url;

     //Append stuff
}});
}

searchbutton.AddEventListener('click', getApi)