/**
 * app.js - USCities Search Application
 * Pure JavaScript implementation following GEMINI.md instructions.
 */

const BASE_URL = 'https://phungph-uscities-microservices.azurewebsites.net';
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results');

let debounceTimer;
let currentAbortController = null;

/**
 * Searches for cities using the Microservice API.
 * Handles AC1-2, AC5-7, AC9, AC11.
 */
async function searchCities() {
    const query = searchInput.value.trim();
    
    // AC9: Trim and validate input. Empty queries never generate a remote request.
    if (!query) {
        resultsContainer.innerHTML = '';
        return;
    }

    // AC6: Ignore/cancel in-flight responses for older queries
    if (currentAbortController) {
        currentAbortController.abort();
    }
    currentAbortController = new AbortController();

    try {
        // AC1, AC2, AC5: Send request to the microservice
        const response = await fetch(`${BASE_URL}/uscities-search/${encodeURIComponent(query)}`, {
            signal: currentAbortController.signal
        });

        if (!response.ok) {
            // AC4/AC11: Handle non-200 status codes (fail safe)
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        
        // AC11: Check for malformed JSON or unexpected shape
        if (!Array.isArray(data)) {
            throw new Error('Malformed response from server');
        }

        renderResults(data);
    } catch (error) {
        // If aborted, do nothing as a newer request is in progress
        if (error.name === 'AbortError') return;
        
        // AC4/AC11: Robust error display
        showError(error.message);
    }
}

/**
 * Renders the search results to the DOM.
 * Handles AC3, AC8, AC10.
 */
function renderResults(data) {
    resultsContainer.innerHTML = '';

    // AC3 / AC8: Handle no matches
    if (data.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No cities found';
        resultsContainer.appendChild(noResults);
        return;
    }

    const list = document.createElement('ul');
    list.className = 'city-list';

    data.forEach(city => {
        const item = document.createElement('li');
        item.className = 'city-item';
        
        // AC10: Output sanitization using textContent to prevent XSS (OWASP A05:2025)
        const strong = document.createElement('strong');
        strong.textContent = city.city;
        
        const details = document.createTextNode(`, ${city.state_name} `);
        
        const zips = document.createElement('span');
        zips.className = 'zip-codes';
        zips.textContent = `ZIPs: ${city.zips}`;

        item.appendChild(strong);
        item.appendChild(details);
        item.appendChild(zips);
        list.appendChild(item);
    });

    resultsContainer.appendChild(list);
}

/**
 * Displays an error message to the user.
 * Handles AC4/AC11.
 */
function showError(message) {
    resultsContainer.innerHTML = '';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Error: ${message}`;
    resultsContainer.appendChild(errorDiv);
}

// --- Event Listeners ---

// AC1-4: Explicit search (Search button click)
searchButton.addEventListener('click', searchCities);

// AC1-4: Explicit search (Enter key press)
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCities();
    }
});

// AC5-8: Live suggestions (on input)
searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    const query = searchInput.value.trim();

    // AC5: At least 2 characters typed for live search
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }

    // AC7: Debounce ~300ms
    debounceTimer = setTimeout(searchCities, 300);
});
