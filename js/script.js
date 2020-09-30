const gallery = document.getElementById('gallery');
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

/**
 * This function generates the HTML to display the user cards on the UI
 * @param {json} data json data of the returned users
 */
function generateUserHTML (users) {
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
            const userSelected = users.filter(user => user.email === userSelectedEmail);
            generateModalHTML(userSelected[0]);
        });
    }
}

/**
 * This function generates the modal HTML and displays it on the page based on the user selected
 * @param {object} user user that was clicked
 */
function generateModalHTML (user) {
    let html = ``;
    const phone = user.phone.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
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
                <p class="modal-text cap">${user.city}</p>
                <hr>
                <p class="modal-text">${phone}</p>
                <p class="modal-text">${user.location.street.number} ${user.location.street.name}, ${user.location.city}, ${user.location.state} ${user.location.postcode}</p>
                <p class="modal-text">Birthday: ${month}/${day}/${year}</p>
            </div>
        </div>
    </div>
    `;
    gallery.insertAdjacentHTML('afterend', html);
    generateCloseButtonListener();
}

/**
 * This creates an event listener on the close button that removes all the html from the DOM.
 */
function generateCloseButtonListener() {
    const close = document.getElementById('modal-close-btn');
    close.addEventListener('click', function (event) {
        gallery.nextElementSibling.remove();
    });
}

//This calls the randomUser API on page load to get and display users
fetchData(randomUserUrl)
    .then(data => {
        users = data.results;
        generateUserHTML(users);
    })
    .catch( err => {
        gallery.insertAdjacentHTML('beforeend', '<h2>Something went wrong!</h2>');
        console.error(err)
    });