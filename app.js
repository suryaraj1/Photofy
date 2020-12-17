const api_key = "563492ad6f91700001000001029c0c9c83fa49fbb4f0622c6d4f6070";

// global selectors
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const submitButton = document.querySelector(".submit-btn");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let searchValue;
let currentSearch;
let page = 1;

// Event listener
searchInput.addEventListener('input', updateInput);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    currentSearch = searchValue;
    searchPhotos(searchValue);
});

more.addEventListener('click', loadMorePhotos);

function updateInput(e) {
    searchValue = e.target.value;
}


async function fetchApi(url) {
    const dataFetch = await fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            Authorization: api_key
        }
    });
    const data = await dataFetch.json();
    return data;
}

function genPictures(data) {
    const photosArray = data.photos;
    photosArray.forEach(photo => {
        // update CSS using JS
        const galleryImage = document.createElement('div');
        galleryImage.classList.add('gallery-img');
        galleryImage.innerHTML = `
        <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a href=${photo.src.original}>Download</a>
        </div>
        <img src=${photo.src.large}></img>
        `;
        console.log(galleryImage);
        gallery.appendChild(galleryImage);
    });
}

// async-await function refactored code for fetching data

async function curatedPhotos() {
    const data = await fetchApi("https://api.pexels.com/v1/curated?per_page=15&page=1");

    genPictures(data);
}

async function searchPhotos(query) {
    clear();
    const data = await fetchApi(`https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`);

    genPictures(data);
}

function clear() {
    // clears prev photos when searched
    // clears the text in input field
    gallery.innerHTML = "";
    searchInput.value = "";
}

async function loadMorePhotos() {
    // increment page index
    page++;
    console.log(page);
    if (currentSearch) {
        fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
    } else {
        fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
    }
    const data = await fetchApi(fetchLink);
    genPictures(data);
}

// for the inital list of photos
curatedPhotos();