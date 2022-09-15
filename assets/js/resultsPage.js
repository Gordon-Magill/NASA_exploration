$.ajax ({
url:"https://api.nasa.gov/planetary/apod?api_key=QMAeSLw9LphOgRCAK702ASasb6X8HaxCufGsvHaw",
success: function(whatyougot){document.getElementBy id("img").innerHTML="imgsrc="+whatyougot.url+"style=width:100%;'/>";
 document.getElementsByTagName(p).innerHTML="By"-whatyougot.copyright;
 document.getEelementByld("title*).innerHTML=whatyougot.title;
 document.getElementByld("explanation*).innerHTIML=whatyougot.explanation;
]}):