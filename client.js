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

function search() {
    var query = searchInput.value.trim();
    if (!query || query.length === 0) return;  // AC-02.2: empty messages are ignored
    console.log(`Debug>query: ${query}`); //for UI testing only
}

function displaySearch(data) {
    //TODO
}