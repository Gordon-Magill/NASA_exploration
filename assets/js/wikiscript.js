//Pulled guidence from this link https://www.youtube.com/watch?v=yqwHxAH1xrw&t=272s to develop and intigrate the api into our project
// below are the queryselectors
const submitButton = document.querySelector('#submit');
const input = document.querySelector('#input');
const errorSpan = document.querySelector('#error');
const resultsContainer = document.querySelector('#results');
// where it pulls from and what it pulls. takes 5000 characters from the topic searched 
const endpoint = 'https://en.wikipedia.org/w/api.php?';
const params = {
    origin: '*',
    format: 'json',
    action: 'query',
    prop: 'extracts',
    exchars: 5000,
    exintro: true,
    explaintext: true,
    generator: 'search',
    gsrlimit: 1,
};

// Disables elements when called
const disUi = () => {
    input.disabled = true;
    submitButton.disabled = true;
};

// Enables elements when called
const enabUi = () => {
    input.disabled = false;
    submitButton.disabled = false;
};

// Empty the wiki container of any previously presented results
const clearPreviousResults = () => {
    resultsContainer.innerHTML = '';
    errorSpan.innerHTML = '';
};

// Determine state of input
const isInputEmpty = input => {
    if (!input || input === '') return true;
    return false;
};

// Alert user to a bad search
const showError = error => {
    errorSpan.innerHTML = `🚨 ${error} 🚨`;
};

// Actually render new wiki content after search
const showResults = results => {
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

// Parsing data
const gatherData = pages => {
    const results = Object.values(pages).map(page => ({
        pageId: page.pageid,
        title: page.title,
        intro: page.extract,
    }));

    showResults(results);
};

// Grab new data
const getData = async () => {
    const userInput = input.value;
    if (isInputEmpty(userInput)) return;

    params.gsrsearch = userInput;
    clearPreviousResults();
    disUi();

    try {
        const { data } = await axios.get(endpoint, { params });

        if (data.error) throw new Error(data.error.info);
        gatherData(data.query.pages);
    } catch (error) {
        showError(error);
    } finally {
        enabUi();
    }
};

// Event handler to allow you to just hit enter to search
const handleKeyEvent = e => {
    if (e.key === 'Enter') {
        getData();
    }
};

// Set up the event handlers
const registerEventHandlers = () => {
    input.addEventListener('keydown', handleKeyEvent);
    submitButton.addEventListener('click', getData);
};

// Make sure event handlers are loaded on page load
registerEventHandlers();