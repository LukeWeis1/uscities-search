/* =========================================================================
 * EECE/CS 3093C Software Engineering - Lab 4
 * client.js - code skeleton provided by Dr. Phu Phung in Lab 1
 * Code complete implementation by Luke Weis
 * =========================================================================
 */

// UI DOM references
var searchBtnElm = document.getElementById('search-button');
if (!searchBtnElm) {
    console.log("Error in getting 'send-button' button");
}
searchBtnElm.addEventListener('click', () => {
    search();
    searchInput.value = ''; // clear the field after an explicit Enter search
});

var searchInput = document.getElementById('search-input');
if (!searchInput) {
    console.log('Error in getting "search-input" input');
}

searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        search();
        searchInput.value = ''; // clear the field after an explicit Enter search
    }
});

const BASE_URL = "https://weisld-uscities-microservices-bqfjfjdba0b5huf4.canadacentral-01.azurewebsites.net/";
async function search() {
    const query = searchInput.value.trim();
    if (!query) return; // AC9: empty/whitespace-only queries never reach fetch()
    console.log(`Debug>query: ${query}`); //for UI testing only
    try {
        const response = await fetch(`${BASE_URL}/uscities-search/${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Unexpected status ${response.status}`); // AC4/AC11: fail safely, not open
        }
        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error('Malformed response'); // AC10: validate shape before display
        }
        displaySearch(data);
    } catch (err) {
        console.log(`Debug>search error: ${err.message}`);
        responses.textContent = 'Error: could not load results.'; // AC4/AC11
    }
}

var responsesElm = document.getElementById('responses');
function displaySearch(data) {
  if(!responsesElm) {
    console.log('Error in getting "responses"');
    return;
  }

  responsesElm.textContent = data.length === 0 ? 'No cities found' : JSON.stringify(data, null, 2);
}