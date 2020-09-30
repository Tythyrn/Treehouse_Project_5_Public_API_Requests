const gallery = document.getElementById('gallery');
const search = document.getElementById('search');
const randomUserUrl = 'https://randomuser.me/api/?nat=us&results=12';
const user = [];

/**
 * This function fetches data from an API and returns the json from the response if it is a fulfilled response
 * @param {string} url this is the url of the API
 */
async function fetchData(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        throw error;
    }
}

function generateSearchBar() {
    let html = `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `;
    search.insertAdjacentHTML('beforeend', html);
}

/**
 * This function generates the HTML to display the user cards on the UI
 * @param {json} data json data of the returned users
 */
function generateUserHTML (users) {
    gallery.innerHTML = '';
    let html = ``;
    for(let user of users) {
        html += `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src=${user.picture.large} alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${user.name.first} ${user.name.last}</h3>
                    <p class="card-text">${user.email}</p>
                    <p class="card-text cap">${user.location.city}, ${user.location.state}</p>
                </div>
            </div>       
        `;
    }
    gallery.insertAdjacentHTML('beforeend', html);
    generateCardEventListeners();
}

/**
 * This function generates the event listeners for every card. The event then grabs the user selected and calls the function to display a modal 
 * I think this is the best way to do it but not sure as it was the only way I could make it so that the card and its contents triggered the event.
 */
function generateCardEventListeners(){
    const cards = gallery.children;
    for(let card of cards) {
        card.addEventListener('click', function (event) {
            const userSelectedEmail = card.children[1].children[1].textContent;  //Gets the email of the selected user
            const currentUsers = searchResults(document.getElementById('search-input').value);
            const userSelected = currentUsers.find(user => user.email === userSelectedEmail);
            const userSelectedIndex = currentUsers.findIndex(user => user.email === userSelectedEmail);
            generateModalHTML(userSelected, userSelectedIndex);
        });
    }
}

/**
 * This function generates the modal HTML and displays it on the page based on the user selected
 * @param {object} user user that was clicked
 */
function generateModalHTML (user, userIndex) {
    let html = ``;
    const phone = user.cell.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    const birthday = new Date(user.dob.date);
    let month = birthday.getMonth().toString();
    let day = birthday.getDate().toString();
    let year = birthday.getFullYear().toString();

    if (month < 10) {
        month = `0${month}`;
    }

    if (day < 10) {
        day = `0${day}`;
    }

    html += `
    <div class="modal-container">
        <div class="modal">
            <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
            <div class="modal-info-container">
                <img class="modal-img" src=${user.picture.large} alt="profile picture">
                <h3 id="name" class="modal-name cap">${user.name.first} ${user.name.last}</h3>
                <p class="modal-text">${user.email}</p>
                <p class="modal-text cap">${user.location.city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${month}/${day}/${year}</p>
            </div>
        </div>
        <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
        </div>
    </div>
    `;
    gallery.insertAdjacentHTML('afterend', html);
    generateCloseButtonListener();
    generatePrevButtonListener(userIndex);
    generateNextButtonListener(userIndex);
}

/**
 * This creates an event listener on the close button that removes all the html from the DOM.
 */
function generateCloseButtonListener() {
    const close = document.getElementById('modal-close-btn');
    close.addEventListener('click', function () {
        gallery.nextElementSibling.remove();
    });
}

/**
 * This function generates the prev button listener.  It displays the previous user based on the users currently displaying on the screen.
 * This is to prevent you from seeing users you have currently filtered
 * @param {number} userIndex Index of user.  Used to prevent you from going out of bounds of the array of users
 */
function generatePrevButtonListener(userIndex) {
    const prev = document.getElementById('modal-prev');
    prev.addEventListener('click', function () {
        const currentUsers = searchResults(document.getElementById('search-input').value);
        if(userIndex > 0) {
            gallery.nextElementSibling.remove();
            generateModalHTML(currentUsers[userIndex - 1], userIndex - 1);
        }
    })
}

/**
 * This function generates the next button listener.  It displays the next user based on the users currently displaying on the screen.
 * This is to prevent you from seeing users you have currently filtered
 * @param {number} userIndex Index of user.  Used to prevent you from going out of bounds of the array of users
 */
function generateNextButtonListener(userIndex) {
    const next = document.getElementById('modal-next');
    next.addEventListener('click', function () {
        const currentUsers = searchResults(document.getElementById('search-input').value);
        if(userIndex < currentUsers.length - 1) {
            gallery.nextElementSibling.remove();
            generateModalHTML(currentUsers[userIndex + 1], userIndex + 1);
        }
    })
}

/**
 * This function finds all the users that match search criteria
 * @param {string} searchInput Search terms entered by user
 * @returns Array of matched users
 */
function searchResults(searchInput) {
    let matchedUsers = [];
 
    for(let user of users) {
        if(user.email.toLowerCase().includes(searchInput.toLowerCase()) ||
           user.name.first.toLowerCase().includes(searchInput.toLowerCase()) ||
           user.name.last.toLowerCase().includes(searchInput.toLowerCase()) ||
           user.location.city.toLowerCase().includes(searchInput.toLowerCase()) ||
           user.location.state.toLowerCase().includes(searchInput.toLowerCase())) {
            matchedUsers.push(user);
        }
    }
    return matchedUsers;
  }

/**
 * This calls the randomUser API on page load to get and display users
 */
fetchData(randomUserUrl)
    .then(data => {
        users = data.results;
        generateSearchBar();
        generateUserHTML(users);
    })
    .catch( err => {
        gallery.insertAdjacentHTML('beforeend', '<h2>Something went wrong!</h2>');
        console.error(err)
    });

/**
 * This is the search button click event
 */
search.addEventListener('click', (e) => {
    if(e.target.tagName === 'BUTTON') {
        const input = e.target.value;
        const userSearchedList = searchResults(input);
    
        generateUserHTML(userSearchedList);
    }
    });

/**
 * This is the search box event that fires on keyup
 */
search.addEventListener('keyup', (e) => {
    if(e.target.tagName === 'INPUT') {
        const input = e.target.value;
        const userSearchedList = searchResults(input);
    
        generateUserHTML(userSearchedList);
    }
    });