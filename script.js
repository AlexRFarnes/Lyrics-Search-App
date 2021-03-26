const API_URL = 'https://api.lyrics.ovh';

const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');


// Search for song or artist
async function searchSongs(searchTerm) {
    const response = await fetch(`${API_URL}/suggest/${searchTerm}`);
    const data = await response.json();
    showData(data);
}

// Display the results in the DOM
function showData(data) {
    result.innerHTML = `
        <ul class="songs-list">
            ${data.data.map(song => `
            <li class="songs-items">
                <span><strong>${song.artist.name}</strong> - ${song.title}</span>
                <button class="btn" data-artist="${song.artist.name}" data-title="${song.title}">Get Lyrics</button>
            </li>
        `)
        .join('')}
        </ul>
        `;
    

        
    if(data.prev || data.next) {
        more.innerHTML = `
        ${data.prev ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` : ""}
        ${data.next ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>` : ""}
                        `;
    } else {
        more.innerHTML = "";
    }

    search.value = '';
    search.focus();
}

// Get prev or next songs
async function getMoreSongs(url) {
    const response = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
    const data = await response.json();

    showData(data);
}

// Get lyrics
async function getLyrics(artist, song) {
    const response  = await fetch(`${API_URL}/v1/${artist}/${song}`);
    const data = await response.json();

    const lyrics  = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br />');
    
    result.innerHTML = `<h2><strong>${artist}</strong> - ${song}</h2>
                        
                        <span>${lyrics}</span>`;
    more.innerHTML= '';
}

// Event listeners
form.addEventListener('submit', e => {
    e.preventDefault();

    const searchTerm = search.value.trim();
    if(!searchTerm) {
        alert('Please enter a search term')
    } else {
        searchSongs(searchTerm);
    }
})

// Get lyrics 
result.addEventListener('click', (e) => {
    const clickedEl = e.target;
    
    if(clickedEl.tagName === 'BUTTON') { 
        const artist = clickedEl.getAttribute('data-artist');
        const song = clickedEl.getAttribute('data-title');

        getLyrics(artist, song);
    }
})