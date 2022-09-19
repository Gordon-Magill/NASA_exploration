
// below are the queryselectors
const submitButton = document.querySelector('#submit');
const input = document.querySelector('#input');
const errorSpan = document.querySelector('#error');
const resultsContainer = document.querySelector('#results');
// where it pulls from and what it pulls. takes 5000 characters from the topic searched 
const endpoint = 'https://en.wikipedia.org/w/api.php?'; // this is the link to the wiki in english 
const params = { // these are the paramaters extracted form the link above. Axious uses these parameters to help us make the url we need for our site.
    origin: '*', // this authenticates the request. this avoids a 403 response
    format: 'json', // outputs datat in JSON format
    action: 'query', // this makes the request
    prop: 'extracts', //Returns plain-text or limited HTML extracts of the given pages.
    exchars: 1200, // this is the amount of characters pulled form a wiki page. 1200 is the max amount of characters
    exintro: true, //Return only content before the first section.
    explaintext: true, // Return extracts as plain text instead of limited HTML.
    generator: 'search', // generator:Get the list of pages to work on by executing the specified query module. search: performs a full text search.
    gsrlimit: 1, // this is a generator function that defines how many pages to return 
};
// this enables and disables the ui to make the search happen 
const changUiState = (isDisabled) => {
    input.disabled = isDisabled;
    submitButton.disabled = isDisabled;
};
//This clears the previous search results in the html container and the search bar
const clearPrevRes = () => {
    resultsContainer.innerHTML = '';
    errorSpan.innerHTML = '';
};
// this retains your search information on the screen if you accidently delete what was in the search bar and cl enter/searh
const emptyInput = input => {
    if (!input || input === '') return true;
    return false;
};
// error message if what is typed in the search bar can't be found
const errorInput = error => {
    errorSpan.innerHTML = `🚨 ${error} 🚨`;
};

const showResults = results => { // this part templates/formats the data to the ui. 
    results.forEach(result => {
        resultsContainer.innerHTML += `
        <div class="results__item">
            <a href="https://en.wikipedia.org/?curid=${result.pageId}" target="_blank" class="card animated bounceInUp">
                <h2 class="results__item__title">${result.title}</h2>
                <p class="results__item__intro">${result.intro}</p>
            </a>
        </div>
    `;
    });
};

const gatherData = pages => { // this function gathers the specified data. page id, title, intro
    const results = Object.values(pages).map(page => ({
        pageId: page.pageid,
        title: page.title,
        intro: page.extract,
    }));

    showResults(results);
};
// this function fetches the users input 
const getData = async () => { // we declared getData with the async function that works with 'await' that works with axios's 'promise' to fetch data
    const userInput = input.value;
    if (emptyInput(userInput)) return;
// parameters of users input. grsearch searches for page titles or matching values.
    params.gsrsearch = userInput;
    clearPrevRes(); // clears previous search results 
    changUiState(); // enables and disables ui
// axios:promise based http client for the browser and node.js. axios helps us communicate with our web api 
    try { // try catch helps fetch specific data
        const { data } = await axios.get(endpoint, { params }); // this is how we get axios to comunicate with our wiki api. this fetches the data 

        if (data.error) throw new Error(data.error.info); // this is what we want to show the user in the ui if there is an error 
        gatherData(data.query.pages);
    } catch (error) {
        errorInput(error); // catch block
    } finally {   // last block of the try catch uses the function that enables and disables the ui 
        changUiState();
    }
};
// this makes it so that when you hit enter the search process begins 
const handleKeyEvent = e => {
    if (e.key === 'Enter') {
        getData();
    }
};
// registering the event listeners so that when you click the search process begins
const registerEventHandlers = () => {
    input.addEventListener('keydown', handleKeyEvent);
    submitButton.addEventListener('click', getData);
};

registerEventHandlers();



//pulled guidence from this link https://www.youtube.com/watch?v=yqwHxAH1xrw&t=272s to develop and intigrate the api into our project
 